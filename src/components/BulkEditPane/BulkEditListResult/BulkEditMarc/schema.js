import { CONTROL_TYPES } from '../../../../constants';
import {
  ACTIONS,
  getAddAction,
  getAdditionalSubfieldAction,
  getAppendAction,
  getFindAction,
  getPlaceholder,
  getRemoveAllAction,
  getRemoveFieldAction,
  getRemoveSubfieldAction,
  getReplaceWithAction
} from '../../../../constants/marcActions';
import { INDICATOR_FIELD_MAX_LENGTH, SUBFIELD_MAX_LENGTH, TAG_FIELD_MAX_LENGTH } from './helpers';

export const schema = [
  {
    name: 'tag',
    label: { id: 'ui-bulk-edit.layer.column.field' },
    type: CONTROL_TYPES.INPUT,
    showWhen: null,
    className: 'field',
    maxLength: TAG_FIELD_MAX_LENGTH,
    disabled: false,
    showError: true,
    dirty: (value) => !!value?.length,
  },
  {
    name: 'ind1',
    label: { id: 'ui-bulk-edit.layer.column.in1' },
    type: CONTROL_TYPES.INPUT,
    showWhen: null,
    className: 'in',
    maxLength: INDICATOR_FIELD_MAX_LENGTH,
    disabled: false,
    dirty: (value) => !!value?.length && value !== '\\'
  },
  {
    name: 'ind2',
    label: { id: 'ui-bulk-edit.layer.column.in2' },
    type: CONTROL_TYPES.INPUT,
    showWhen: null,
    className: 'in',
    maxLength: INDICATOR_FIELD_MAX_LENGTH,
    disabled: false,
    dirty: (value) => !!value?.length && value !== '\\'
  },
  {
    name: 'subfield',
    label: { id: 'ui-bulk-edit.layer.column.subfield' },
    type: CONTROL_TYPES.INPUT,
    showWhen: null,
    className: 'subfield',
    maxLength: SUBFIELD_MAX_LENGTH,
    disabled: false,
    showError: true,
    dirty: (value) => !!value?.length,
  },
  {
    name: 'actions',
    showWhen: null,
    type: CONTROL_TYPES.ARRAY,
    disabled: false,
    itemSchema: [
      {
        name: 'name',
        label: { id: 'ui-bulk-edit.layer.column.actions' },
        type: CONTROL_TYPES.SELECT_MENU,
        className: 'actions',
        showWhen: null,
        disabled: false,
        actionIndexInPath: 2,
        required: ({ index, parentArray }) => {
          if (index === 1) {
            return parentArray[0]?.name === ACTIONS.FIND;
          }

          return true;
        },
        dirty: (value) => !!value?.length,
        options: ({
          parentArray,
          index
        }) => {
          if (index === 0) {
            return [
              getPlaceholder(),
              getAddAction(),
              getFindAction(),
              getRemoveAllAction(),
            ];
          }

          switch (parentArray[0]?.name) {
            case ACTIONS.ADD_TO_EXISTING:
              return [
                getPlaceholder(),
                getAdditionalSubfieldAction(),
              ];
            case ACTIONS.FIND:
              return [
                getPlaceholder(),
                getAppendAction(),
                getRemoveFieldAction(),
                getRemoveSubfieldAction(),
                getReplaceWithAction(),
              ];
            case ACTIONS.REMOVE_ALL:
              return null;
            default:
              return null;
          }
        },
      },
      {
        name: 'data',
        type: CONTROL_TYPES.ARRAY,
        itemSchema: [
          {
            name: 'value',
            label: { id: 'ui-bulk-edit.layer.column.data' },
            type: CONTROL_TYPES.TEXTAREA,
            required: true,
            actionIndexInPath: 2,
            showError: true,
            dirty: (value) => !!value?.length
          }
        ]
      }
    ]
  },
];

export const subfieldsSchema = [
  {
    name: 'tag',
    label: { id: 'ui-bulk-edit.layer.column.field' },
    type: CONTROL_TYPES.EMPTY,
    className: 'field',
  },
  {
    name: 'ind1',
    label: { id: 'ui-bulk-edit.layer.column.in1' },
    type: CONTROL_TYPES.EMPTY,
    className: 'in',
  },
  {
    name: 'ind2',
    label: { id: 'ui-bulk-edit.layer.column.in2' },
    type: CONTROL_TYPES.EMPTY,
    className: 'in',
  },
  {
    name: 'subfield',
    label: { id: 'ui-bulk-edit.layer.column.subfield' },
    type: CONTROL_TYPES.INPUT,
    showWhen: null,
    className: 'subfield',
    maxLength: SUBFIELD_MAX_LENGTH,
    disabled: false,
    dirty: (value) => !!value?.length,
  },
  {
    name: 'actions',
    showWhen: null,
    type: CONTROL_TYPES.ARRAY,
    itemSchema: [
      {
        name: 'name',
        label: { id: 'ui-bulk-edit.layer.column.actions' },
        type: CONTROL_TYPES.SELECT_MENU,
        className: 'actions',
        showWhen: null,
        actionIndexInPath: 4,
        disabled: ({ index }) => index === 0,
        dirty: (value) => !!value?.length,
        options: ({
          index
        }) => {
          if (index === 0) {
            return [
              getAddAction(),
            ];
          }

          return [
            getPlaceholder(),
            getAdditionalSubfieldAction(),
          ];
        },
      },
      {
        name: 'data',
        type: CONTROL_TYPES.ARRAY,
        itemSchema: [
          {
            name: 'value',
            label: { id: 'ui-bulk-edit.layer.column.data' },
            type: CONTROL_TYPES.TEXTAREA,
            maxLength: 0,
            required: true,
            actionIndexInPath: 4,
            dirty: (value) => !!value?.length,
          }
        ]
      }
    ]
  },
];
