import { ACTIONS } from '../../../../constants/marcActions';
import { CONTROL_TYPES } from '../../../../constants';


export const TAG_FIELD_MAX_LENGTH = 3;
export const INDICATOR_FIELD_MAX_LENGTH = 1;
export const SUBFIELD_MAX_LENGTH = 1;

export const DATA_KEYS = {
  VALUE: 'VALUE',
  SUBFIELD: 'SUBFIELD',
};

/**
 * Creates a new MARC field template with default values.
 * @param {string|number} id - Unique identifier for this field instance.
 * @returns {Object} New field object with default structure.
 */
export const getMarcFieldTemplate = (id) => ({
  id,
  tag: '',
  ind1: '\\',
  ind2: '\\',
  subfield: '',
  actions: [
    {
      name: '',
      data: []
    }
  ],
  subfields: []
});

/**
 * Creates a new subfield template with default actions.
 * @param {string|number} id - Unique identifier for this subfield.
 * @returns {Object} New subfield object with default actions and data.
 */
export const getSubfieldTemplate = (id) => ({
  id,
  subfield: '',
  actions: [
    {
      name: ACTIONS.ADD_TO_EXISTING,
      data: [
        {
          key: DATA_KEYS.VALUE,
          value: ''
        }
      ]
    },
    {
      name: '',
      data: []
    }
  ]
});

/**
 * Determines the next action placeholder based on the current action.
 * @param {string} action - The current action type.
 * @returns {Object|null} A new action object template or null if none.
 */
export const getNextAction = (action) => {
  switch (action) {
    case ACTIONS.ADD_TO_EXISTING:
    case ACTIONS.FIND:
      // After adding or finding, reset to an empty action slot
      return {
        name: '',
        data: [],
      };
    case ACTIONS.REMOVE_ALL:
      // No further action after removing all
      return null;
    default:
      return null;
  }
};

/**
 * Provides default data entries for a given action type.
 * @param {string} action - The action type for which data template is needed.
 * @returns {Array<Object>} Array of data key/value pairs.
 */
export const getNextData = (action) => {
  switch (action) {
    case ACTIONS.ADD_TO_EXISTING:
    case ACTIONS.FIND:
    case ACTIONS.REPLACE_WITH:
      return [{ key: DATA_KEYS.VALUE, value: '' }];
    case ACTIONS.APPEND:
      // Append requires both a target subfield and a value
      return [
        { key: DATA_KEYS.SUBFIELD, value: '' },
        { key: DATA_KEYS.VALUE, value: '' }
      ];
    case ACTIONS.REMOVE_ALL:
      // Removing all requires no extra data
      return [];
    default:
      return [];
  }
};

/**
 * Calculates how many columns a field will occupy in the UI based on actions and data.
 * This is used to determine the head layout of the bulk edit form.
 * @param {Object} field - The field object containing actions and data arrays.
 * @returns {number} Total column count.
 */
const getMaxFieldColumnsCount = (field) => {
  let sum = field.actions.filter(Boolean).length;

  field.actions.forEach(action => {
    sum += action?.data.filter(Boolean).length || 0;
  });

  return sum;
};

/**
 * Finds the field with the maximum number of columns among a list.
 * @param {Array<Object>} fields - Array of field objects.
 * @returns {Object} The field object with the greatest column count.
 */
export const getFieldWithMaxColumns = (fields) => {
  return fields.reduce((acc, item) => {
    return getMaxFieldColumnsCount(item) > getMaxFieldColumnsCount(acc) ? item : acc;
  }, fields[0]);
};

/**
 * Provides overrides for control rendering based on the data key.
 * @param {string} key - DATA_KEYS value indicating which override to apply.
 * @returns {Object|string} Configuration overrides or the key if none.
 */
export const getOverridesByKey = (key) => {
  switch (key) {
    case DATA_KEYS.SUBFIELD:
      return {
        type: CONTROL_TYPES.INPUT,
        className: 'subfield',
        maxLength: SUBFIELD_MAX_LENGTH,
        required: true,
        key,
      };
    case DATA_KEYS.VALUE:
      return {
        type: CONTROL_TYPES.TEXTAREA,
        className: 'data',
        required: true,
        key,
      };
    default:
      // Return the raw key if no specific overrides exist
      return key;
  }
};

/**
 * Converts an array-based path to a dot-and-bracket notation string.
 * @param {Array<string|number>} pathArray - e.g. [0, 'subfield', 2, 'name'].
 * @returns {string} Path string, e.g. "[0].subfield[2].name".
 */
export const pathArrayToString = (pathArray) => {
  return pathArray.reduce((acc, segment) => {
    if (typeof segment === 'number') {
      return `${acc}[${segment}]`;
    }
    return acc ? `${acc}.${segment}` : segment;
  }, '');
};
