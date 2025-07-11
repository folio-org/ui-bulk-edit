import { useState } from 'react';
import { isEqual, omit, uniqueId } from 'lodash';

import { getFormErrors } from '../utils/helpers';

export const useBulkEditForm = ({ initialValues, validationSchema, template }) => {
  const [fields, setFields] = useState(initialValues || [template(uniqueId())]);

  const errors = getFormErrors(fields, validationSchema);
  const isValid = Object.keys(errors).length === 0;

  const fieldsWithoutId = fields.map(item => omit(item, ['id']));
  const isPristine = isEqual([template()], fieldsWithoutId);

  return {
    fields,
    setFields,
    isValid,
    isPristine,
  };
};
