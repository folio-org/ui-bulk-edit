import { useIntl } from 'react-intl';

import { isEqual, omit } from 'lodash';
import { getMarcFormErrors } from '../components/BulkEditPane/BulkEditListResult/BulkEditMarc/validation';
import {
  getMappedContentUpdates,
  isContentUpdatesFormValid
} from '../components/BulkEditPane/BulkEditListResult/BulkEditInApp/ContentUpdatesForm/helpers';
import { getAdministrativeDataOptions } from '../constants';
import { getTransformedField } from '../components/BulkEditPane/BulkEditListResult/BulkEditMarc/helpers';

export const MARC_FORM_INITIAL_STATE = [
  {
    tag: '',
    ind1: '\\',
    ind2: '\\',
    subfield: '',
    actions: [{
      name: '',
      data: []
    }],
    parameters: [],
    subfields: [],
  }
];

export const ADMINISTRATIVE_FORM_INITIAL_STATE = [
  {
    option: '',
    tenants: [],
    actions: [
      {
        initial: undefined,
        updated: undefined,
        type: undefined,
        tenants: [],
        updated_tenants: [],
        parameters: []
      }
    ]
  }
];

export const useMarcApproachValidation = ({ fields, marcFields }) => {
  const { formatMessage } = useIntl();
  const options = getAdministrativeDataOptions(formatMessage);

  const marcFormErrors = getMarcFormErrors(marcFields);
  const marcContentUpdates = marcFields.map(getTransformedField);
  const marcContentUpdatesWithoutId = marcContentUpdates.map(item => omit(item, ['id']));
  const contentUpdates = getMappedContentUpdates(fields, options);

  const isMarcFieldsValid = Object.keys(marcFormErrors).length === 0;
  const isAdministrativeFormValid = isContentUpdatesFormValid(contentUpdates);

  const isAdministrativeFormPristine = !isEqual(ADMINISTRATIVE_FORM_INITIAL_STATE, contentUpdates);
  const isMarcFormPristine = !isEqual(MARC_FORM_INITIAL_STATE, marcContentUpdatesWithoutId);

  return {
    options,
    isMarcFieldsValid,
    isMarcFormPristine,
    isAdministrativeFormValid,
    isAdministrativeFormPristine,
    contentUpdates,
    marcContentUpdates,
  };
};
