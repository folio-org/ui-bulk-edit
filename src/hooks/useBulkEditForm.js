import { useState } from 'react';
import { isEqual, omit, uniqueId } from 'lodash';

import { getFormErrors } from '../utils/helpers';
import { OPTIONS } from '../constants';
import { getFormattedDate } from '../components/BulkEditPane/BulkEditListResult/BulkEditInApp/helpers';

export const useBulkEditForm = ({ initialValues, validationSchema, template }) => {
  const [fields, setFields] = useState(initialValues || [template(uniqueId())]);

  const errors = getFormErrors(fields, validationSchema);
  const isValid = Object.keys(errors).length === 0;

  // Update expiration date values formatted date strings
  // This is necessary to ensure that the date values are compared correctly
  const fieldsWithUpdatedDate = fields.map(item => {
    if (item.option === OPTIONS.EXPIRATION_DATE) {
      return {
        ...item,
        actionsDetails: {
          actions: item.actionsDetails.actions.map(action => ({
            ...action,
            value: getFormattedDate(action.value)
          })),
        }
      };
    }

    return item;
  });
  const fieldsWithoutId = fieldsWithUpdatedDate.map(item => omit(item, ['id']));
  const initialValuesWithoutId = initialValues?.map(item => omit(item, ['id']));
  const isPristine = isEqual(initialValuesWithoutId || [template()], fieldsWithoutId);

  return {
    fields,
    setFields,
    isValid,
    isPristine,
  };
};
