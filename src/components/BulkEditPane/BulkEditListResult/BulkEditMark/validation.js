import { array, object, string } from 'yup';

import { INDICATOR_FIELD_MAX_LENGTH, SUBFIELD_MAX_LENGTH } from './helpers';


const subfieldSchema = {
  subfield: string().required().length(SUBFIELD_MAX_LENGTH),
  actions: array(object({
    name: string().test(
      'action-name',
      '',
      (value, context) => {
        return context.parent.meta.required ? !!value : true;
      },
    ),
    data: array(object({
      key: string().required(),
      value: string().required(),
    })),
  }).nullable()),
};

const schema = array(object({
  tag: string().required().test(
    'is-in-range',
    'ui-bulk-edit.layer.marc.error',
    (value) => {
      const parsedValue = Number(value);
      return (parsedValue >= 500 && parsedValue <= 599) || (parsedValue >= 900 && parsedValue <= 999);
    },
  ),
  ind1: string().required().length(INDICATOR_FIELD_MAX_LENGTH),
  ind2: string().required().length(INDICATOR_FIELD_MAX_LENGTH),
  subfields: array(object(subfieldSchema)).nullable(),
  ...subfieldSchema,
}));

export const getMarkFormErrors = (fields) => {
  let errors = {};
  const cleanedFields = fields.map(field => ({
    ...field,
    actions: field.actions.filter(Boolean).map(action => ({
      ...action,
      data: action.data.filter(Boolean),
    })),
  }));

  try {
    schema.validateSync(cleanedFields, { strict: true, abortEarly: false });
  } catch (e) {
    errors = e.inner?.reduce((acc, error) => {
      acc[error.path] = error.message;
      return acc;
    }, {});
  }

  return errors;
};
