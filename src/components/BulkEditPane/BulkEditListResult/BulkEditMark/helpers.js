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
  title = <FormattedMessage id="ui-bulk-edit.layer.column.data" />,
} = {}) => ({
  meta: {
    title,
    required,
  },
  key,
  value: '',
});

export const getDefaultMarkTemplate = (id) => ({
  id,
  tag: '',
  ind1: '\\',
  ind2: '\\',
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
          disabled: false,
          required: false,
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
    case ACTIONS.APPEND:
      return [
        getDataTemplate({
          key: DATA_KEYS.SUBFIELD,
          title: <FormattedMessage id="ui-bulk-edit.layer.column.subfield" />,
        }),
        getDataTemplate(),
      ];
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

export const getTransformedField = (field) => ({
  ...field,
  // if subfields exist, recursively transform them
  ...(field.subfields && { subfields: field?.subfields.filter(Boolean).map(getTransformedField) }),
  // transform actions and data
  actions: field.actions.filter(Boolean).map(action => {
    const { name, data } = action;

    return {
      name,
      data: data.filter(Boolean).map(({ key, value }) => ({ key, value })),
    };
  }),
});
