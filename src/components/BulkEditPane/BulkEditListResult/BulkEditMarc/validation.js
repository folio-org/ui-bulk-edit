import { array, object, string } from 'yup';

import { INDICATOR_FIELD_MAX_LENGTH } from './helpers';
import { ACTIONS } from '../../../../constants/marcActions';


const subfieldSchema = {
  subfield: string()
    .required()
    .test(
      'is-valid-subfield',
      'ui-bulk-edit.layer.marc.error.subfield',
      value => /^[a-z-0-9]+$/.test(value),
    ),

  actions: array()
    .of(
      object({
        name: string(),
        data: array()
          .of(
            object({
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
            })
          )
          .nullable(),
      })
    )
    .test(
      'second-name-required',
      'ui-bulk-edit.layer.marc.error.actionNameRequired',
      (actions, context) => {
        if (!actions) return true;

        const firstName = actions[0]?.name;
        if (firstName !== ACTIONS.ADD_TO_EXISTING) {
          const second = actions[1];
          if (second && (!second?.name || !second.name.trim())) {
            return context.createError({
              path: `${context.path}[1].name`,
              message: 'ui-bulk-edit.layer.marc.error.actionNameRequired',
            });
          }
        }

        return true;
      }
    ),
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
}).test(
  'tag-999',
  'ui-bulk-edit.layer.marc.error.protected',
  (value, context) => {
    if (value.tag === '999' && value.ind1 === 'f' && value.ind2 === 'f') {
      return context.createError({
        path: `${context.path}.subfield`,
        message: 'ui-bulk-edit.layer.marc.error.protected',
      });
    }

    return true;
  }
));


export const getMarcFormErrors = (fields) => {
  let errors = {};

  try {
    schema.validateSync(fields, { strict: true, abortEarly: false });
  } catch (e) {
    errors = e.inner?.reduce((acc, error) => {
      acc[error.path] = error.message;
      return acc;
    }, {});
  }

  return errors;
};
