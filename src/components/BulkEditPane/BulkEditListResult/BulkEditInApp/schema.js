import {
  CONTROL_TYPES,
  FINAL_ACTIONS,
} from '../../../../constants';
import { getControlType, getDefaultActionLists, getNextActionLists, getNextControlType } from './controlsConfig';

export const schema = [
  {
    name: 'actions',
    showWhen: null,
    type: CONTROL_TYPES.ARRAY,
    disabled: false,
    itemSchema: [
      {
        name: 'name',
        label: { id: 'ui-bulk-edit.layer.column.actions' },
        type: CONTROL_TYPES.ACTION,
        showWhen: null,
        disabled: false,
        colSize: 2,
        dirty: (value) => !!value,
        options: ({ index, option, recordType, parentArray }) => {
          if (index === 0) {
            return getDefaultActionLists(option, recordType);
          }

          return getNextActionLists(option, parentArray[0]?.name);
        },
      },
      {
        name: 'value',
        label: { id: 'ui-bulk-edit.layer.column.data' },
        colSize: 2,
        disabled: false,
        renderParameters: true,
        dirty: (value) => !!value,
        type: ({ option, index, parentArray }) => {
          if (index === 0) {
            const action = parentArray[index]?.name;

            return getControlType(option, action);
          }

          const prevAction = parentArray[index - 1]?.name;

          return getNextControlType(option, prevAction);
        },
        showWhen: ({ index, parentArray }) => {
          const { name, parameters } = parentArray[index];

          // Filter out actions that are only for specific actions
          const filteredParams = parameters?.filter(param => !(param.onlyForActions && !param.onlyForActions.includes(name)));

          return name && (!FINAL_ACTIONS.includes(name) || filteredParams?.length > 0);
        }
      },
    ]
  },
];
