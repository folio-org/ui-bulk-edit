import {
  CONTROL_TYPES,
  FINAL_ACTIONS,
} from '../../../../constants';
import { getControlType, getDefaultActionLists, getNextActionLists, getNextControlType } from './controlsConfig';

/**
 * Bulk edit schema definition for the ‘actions’ array control.
 * Defines how action names and corresponding parameter inputs
 * should be rendered, validated, and interdependent.
 */

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

        /**
         * Chooses appropriate control type for the parameter input:
         * - For the first action entry, derive from controlConfig.
         * - For subsequent entries, pick type based on previous action.
         * @param {Object} context
         * @param {string} context.option
         * @param {number} context.index
         * @param {Array} context.parentArray
         * @returns {string}
         */
        type: ({ option, index, parentArray }) => {
          if (index === 0) {
            const action = parentArray[index]?.name;
            return getControlType(option, action);
          }

          const prevAction = parentArray[index - 1]?.name;
          return getNextControlType(option, prevAction);
        },

        /**
         * Determines visibility of the value field:
         * - Hidden for final actions with no parameters.
         * - Always shown if action name is present and parameters exist.
         * @param {Object} context
         * @param {number} context.index
         * @param {Array} context.parentArray
         * @returns {boolean}
         */
        showWhen: ({ index, parentArray }) => {
          const { name, parameters } = parentArray[index];
          const filteredParams = parameters?.filter(param => !(param.onlyForActions && !param.onlyForActions.includes(name)));

          return name && (
            !FINAL_ACTIONS.includes(name)
            || filteredParams?.length > 0
          );
        }
      },
    ]
  },
];
