import { array, object, string } from 'yup';

import { DATA_KEYS, INDICATOR_FIELD_MAX_LENGTH } from './helpers';
import { ACTIONS } from '../../../../constants/marcActions';

/**
 * Schema definition for validating individual subfield entries within a MARC field.
 * Ensures the subfield code and its associated actions conform to expected formats.
 */
const subfieldSchema = {
  subfield: string()
    .required()
    .test(
      'is-valid-subfield',
      'ui-bulk-edit.layer.marc.error.subfield',
      value => /^[a-z0-9]+$/.test(value), // Only lowercase alphanumeric characters allowed
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
                    // If key indicates a subfield, enforce the same format rules on its value
                    if (key === DATA_KEYS.SUBFIELD) {
                      return /^[a-z0-9]+$/.test(value);
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
        // If the first action is not ADD_TO_EXISTING, ensure a second action name is provided
        if (firstName !== ACTIONS.ADD_TO_EXISTING) {
          const second = actions[1];

          if (!second?.name?.trim()) {
            return context.createError({
              path: `${context.path}[1].name`, // Point error to second action's name property
              message: 'ui-bulk-edit.layer.marc.error.actionNameRequired',
            });
          }
        }
        return true;
      }
    ),
};

// Regular expression allowing Latin letters, digits, spaces, and backslashes
const latinRegex = /^[a-zA-Z0-9\s\\]+$/;

/**
 * Top-level schema for validating an array of MARC field objects.
 * Validates tags, indicators, and nested subfields according to MARC rules.
 */
const schema = array(
  object({
    tag: string()
      .required()
      .test(
        'is-valid-tag',
        'ui-bulk-edit.layer.marc.error',
        value => Number(value) > 9 // Tags must represent a number greater than 9
      ),
    ind1: string()
      .required()
      .length(INDICATOR_FIELD_MAX_LENGTH)
      .test(
        'is-latin',
        'ui-bulk-edit.layer.marc.error.ind',
        value => latinRegex.test(value) // Indicators must match Latin character set
      ),
    ind2: string()
      .required()
      .length(INDICATOR_FIELD_MAX_LENGTH)
      .test(
        'is-latin',
        'ui-bulk-edit.layer.marc.error.ind',
        value => latinRegex.test(value)
      ),
    subfields: array(object(subfieldSchema)).nullable(),
    ...subfieldSchema,
  }).test(
    'tag-999',
    'ui-bulk-edit.layer.marc.error.protected',
    (value, context) => {
      // Disallow editing of protected 999 fields with indicators 'f' and 'f' because they are protected
      if (value.tag === '999' && value.ind1 === 'f' && value.ind2 === 'f') {
        return context.createError({
          path: `${context.path}.subfield`,
          message: 'ui-bulk-edit.layer.marc.error.protected',
        });
      }
      return true;
    }
  )
);

/**
 * Validates an array of MARC field data against the schema.
 * @param {Array<Object>} fields - The collection of field objects to validate.
 * @returns {Object} A map of error paths to their corresponding error message IDs.
 */
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
