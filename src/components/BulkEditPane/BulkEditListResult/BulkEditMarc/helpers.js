import { ACTIONS } from '../../../../constants/marcActions';
import { CONTROL_TYPES } from '../../../../constants';


export const TAG_FIELD_MAX_LENGTH = 3;
export const INDICATOR_FIELD_MAX_LENGTH = 1;
export const SUBFIELD_MAX_LENGTH = 1;

export const DATA_KEYS = {
  VALUE: 'VALUE',
  SUBFIELD: 'SUBFIELD',
};

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
    },
  ],
  subfields: [],
});

export const getSubfieldTemplate = (id) => ({
  id,
  subfield: '',
  actions: [
    {
      name: ACTIONS.ADD_TO_EXISTING,
      data: [
        {
          key: DATA_KEYS.VALUE,
          value: '',
        }
      ]
    },
    {
      name: '',
      data: []
    },
  ],
});

export const getNextAction = (action) => {
  switch (action) {
    case ACTIONS.ADD_TO_EXISTING:
    case ACTIONS.FIND:
      return {
        name: '',
        data: [],
      };
    case ACTIONS.REMOVE_ALL:
      return null;
    default:
      return null;
  }
};

export const getNextData = (action) => {
  switch (action) {
    case ACTIONS.ADD_TO_EXISTING:
    case ACTIONS.FIND:
    case ACTIONS.REPLACE_WITH:
      return [{ key: DATA_KEYS.VALUE, value: '' }];
    case ACTIONS.APPEND:
      return [{ key: DATA_KEYS.SUBFIELD, value: '' }, { key: DATA_KEYS.VALUE, value: '' }];
    case ACTIONS.REMOVE_ALL:
      return [];
    default:
      return [];
  }
};

const getMaxFieldColumnsCount = (field) => {
  let sum = field.actions.filter(Boolean).length;

  field.actions.forEach(action => {
    sum += action?.data.filter(Boolean).length || 0;
  });

  return sum;
};

export const getFieldWithMaxColumns = (fields) => {
  return fields.reduce((acc, item) => {
    if (getMaxFieldColumnsCount(item) > getMaxFieldColumnsCount(acc)) {
      return item;
    }

    return acc;
  }, fields[0]);
};

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
      return key;
  }
};

/**
 * Converts an array path (e.g. [0, 'subfield', 2, 'name'])
 * into a path string ("[0].subfield[2].name").
 */
export const pathArrayToString = (pathArray) => {
  return pathArray.reduce((acc, segment) => {
    if (typeof segment === 'number') {
      return `${acc}[${segment}]`;
    }

    return acc ? `${acc}.${segment}` : segment;
  }, '');
};
