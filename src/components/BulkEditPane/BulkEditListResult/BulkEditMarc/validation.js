import { array, object, string } from 'yup';

import { DATA_KEYS, INDICATOR_FIELD_MAX_LENGTH } from './helpers';
import { ACTIONS } from '../../../../constants/marcActions';

const SUBFIELD_FORMAT_TEST = [
  'is-valid-subfield',
  'ui-bulk-edit.layer.marc.error.subfield',
  value => /^[a-z0-9]+$/.test(value),
];

// Actions that require the row-level subfield to be populated
const SUBFIELD_REQUIRED_ACTIONS = [ACTIONS.ADD_TO_EXISTING, ACTIONS.FIND, ACTIONS.REMOVE_SUBFIELD];

/**
 * Schema definition for validating individual subfield entries within a MARC field.
 * Ensures the subfield code and its associated actions conform to expected formats.
 */
const subfieldSchema = {
  subfield: string()
    .required()
    .test(...SUBFIELD_FORMAT_TEST),

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

          if (second && !second?.name?.trim()) {
            return context.createError({
              path: `${context.path}[1].name`, // Point error to second action's name property
              message: 'ui-bulk-edit.layer.marc.error.actionNameRequired',
            });
          }
        }

        return !!firstName;
      }
    ),
};

// Regular expression allowing Latin letters, digits, spaces, and backslashes
const latinRegex = /^[a-zA-Z0-9\s\\]+$/;

/**
 * Top-level schema for validating an array of MARC field objects.
 * Validates tags, indicators, and nested subfields according to MARC rules.
 */
export const validationSchema = array(
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
    subfield: string().when('actions', {
      is: (actions) => SUBFIELD_REQUIRED_ACTIONS.includes(actions?.[0]?.name),
      then: (schema) => schema.required().test(...SUBFIELD_FORMAT_TEST),
      otherwise: (schema) => schema,
    }),
    actions: subfieldSchema.actions,
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
