import { array, object, string } from 'yup';

import { INDICATOR_FIELD_MAX_LENGTH, SUBFIELD_MAX_LENGTH } from './helpers';


const subfieldSchema = {
  subfield: string()
    .required()
    .length(SUBFIELD_MAX_LENGTH)
    .test(
      'is-valid-subfield',
      'ui-bulk-edit.layer.marc.error.subfield',
      (value) => /^[a-z-0-9]+$/.test(value),
    ),
  actions: array(object({
    name: string()
      .test(
        'action-name',
        '',
        (value, context) => {
          return context.parent.meta.required ? !!value : true;
        },
      ),
    data: array(object({
      key: string().required(),
      value: string()
        .required()
        .test(
          'is-valid-additional-subfield',
          'ui-bulk-edit.layer.marc.error.subfield',
          (value, context) => {
            const { key } = context.parent;
            if (key === 'SUBFIELD') {
              return /^[a-z-0-9]+$/.test(value);
            }
            return true;
          }
        ),
    })),
  })
    .nullable()),
};

const latinRegex = /^[a-zA-Z0-9\s\\]+$/;

const schema = array(object({
  tag: string().required().test(
    'is-valid-tag',
    'ui-bulk-edit.layer.marc.error',
    (value) => Number(value) > 9,
  ),
  ind1: string()
    .required()
    .length(INDICATOR_FIELD_MAX_LENGTH)
    .test(
      'is-latin',
      'ui-bulk-edit.layer.marc.error.ind',
      (value) => latinRegex.test(value)
    ),
  ind2: string()
    .required()
    .length(INDICATOR_FIELD_MAX_LENGTH)
    .test(
      'is-latin',
      'ui-bulk-edit.layer.marc.error.ind',
      (value) => latinRegex.test(value)
    ),
  subfields: array(object(subfieldSchema)).nullable(),
  ...subfieldSchema,
}).test('tag-999', 'ui-bulk-edit.layer.marc.error.protected', (value) => {
  return !(value.tag === '999' && value.ind1 === 'f' && value.ind2 === 'f');
}));


export const getMarcFormErrors = (fields) => {
  let errors = {};
  const cleanedFields = fields.map(field => {
    return ({
      ...field,
      actions: field.actions.filter(Boolean).map(action => ({
        ...action,
        data: action.data.filter(Boolean),
      })),
    });
  });

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
