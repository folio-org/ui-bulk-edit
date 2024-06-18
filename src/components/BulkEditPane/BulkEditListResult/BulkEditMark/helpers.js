import { FormattedMessage } from 'react-intl';
import {
  ACTIONS,
  getAddAction,
  getAdditionalSubfieldAction,
  getAppendAction,
  getPlaceholder,
  getRemoveFieldAction,
  getRemoveSubfieldAction,
  getReplaceWithAction,
  markActions,
} from '../../../../constants/markActions';

export const TAG_FIELD_MAX_LENGTH = 3;
export const INDICATOR_FIELD_MAX_LENGTH = 1;
export const SUBFIELD_MAX_LENGTH = 1;

export const DATA_KEYS = {
  VALUE: 'VALUE',
  SUBFIELD: 'SUBFIELD',
};

export const getDataTemplate = ({
  required = true,
  key = DATA_KEYS.VALUE,
} = {}) => ({
  meta: {
    title: <FormattedMessage id="ui-bulk-edit.layer.column.data" />,
    required,
  },
  key,
  value: '',
});

export const getDefaultMarkTemplate = (id) => ({
  id,
  value: '',
  in1: '\\',
  in2: '\\',
  subfield: '',
  actions: [
    {
      meta: {
        options: markActions(),
        required: true,
      },
      name: '',
      data: []
    },
  ],
  parameters: [],
  subfields: [],
});

export const getSubfieldTemplate = (id) => ({
  id,
  subfield: '',
  actions: [
    {
      meta: {
        options: [
          getPlaceholder(),
          getAddAction(),
        ],
        disabled: true,
        required: true,
      },
      name: ACTIONS.ADD_TO_EXISTING,
      data: [
        {
          meta: {
            title: <FormattedMessage id="ui-bulk-edit.layer.column.data" />,
            required: true,
          },
          key: DATA_KEYS.VALUE,
          value: '',
        }
      ]
    },
    {
      meta: {
        options: [
          getPlaceholder(),
          getAdditionalSubfieldAction(),
        ],
        disabled: false,
        required: false,
      },
      name: '',
      data: []
    },
  ],
});

export const getNextAction = (action) => {
  switch (action) {
    case ACTIONS.ADD_TO_EXISTING:
      return {
        meta: {
          options: [
            getPlaceholder(),
            getAdditionalSubfieldAction(),
          ],
        },
        name: '',
        data: [],
      };
    case ACTIONS.FIND:
      return {
        meta: {
          required: true,
          options: [
            getPlaceholder(),
            getAppendAction(),
            getRemoveFieldAction(),
            getRemoveSubfieldAction(),
            getReplaceWithAction(),
          ],
        },
        name: '',
        data: [],
      };
    case ACTIONS.REMOVE_ALL:
      return null;
    default:
      return null;
  }
};

export const getNextDataControls = (action) => {
  switch (action) {
    case ACTIONS.ADD_TO_EXISTING:
    case ACTIONS.FIND:
    case ACTIONS.REPLACE_WITH:
      return [
        getDataTemplate(),
      ];
    case ACTIONS.REMOVE_ALL:
      return [];
    default:
      return [];
  }
};

export const isMarkValueValid = (value) => {
  const userInput = value.trim();

  const num = Number(userInput);
  return (num >= 500 && num <= 599) || (num >= 900 && num <= 999);
};

export const isMarkFormValid = (fields) => {
  return fields.every(field => {
    const allFieldsValid = Object.values(field).every(Boolean);
    const valueValid = isMarkValueValid(field.value);

    return allFieldsValid && valueValid;
  });
};

export const getMaxFieldColumnsCount = (field) => {
  let sum = field.actions.length;

  field.actions.forEach(action => {
    sum += action?.data.length || 0;
  });

  return sum;
};
