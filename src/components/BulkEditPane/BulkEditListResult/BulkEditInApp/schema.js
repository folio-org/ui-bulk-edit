import { CONTROL_TYPES } from '../../../../constants';
import { getControlType, getDefaultActionLists, getNextActionLists, getNextControlType } from './controlsConfig';
import { getOptionType, shouldShowValueColumn } from './helpers';

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
        options: ({ index, option, recordType, parentArray, allOptions, approach }) => {
          const optionType = getOptionType(option, allOptions);

          if (index === 0) {
            return getDefaultActionLists(optionType, recordType, approach);
          }

          return getNextActionLists(optionType, parentArray[0]?.name);
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
        type: ({ option, index, parentArray, allOptions }) => {
          const optionType = getOptionType(option, allOptions);

          if (index === 0) {
            const action = parentArray[index]?.name;
            return getControlType(optionType, action);
          }

          const prevAction = parentArray[index - 1]?.name;
          return getNextControlType(optionType, prevAction);
        },

        /**
         * Determines visibility of the value field:
         * - Hidden for final actions with no parameters.
         * - Always shown if action name is present and parameters exist.
         * - Hidden for notes parameters as they are not editable.
         * @param {Object} context
         * @param {number} context.index
         * @param {Array} context.parentArray
         * @returns {boolean}
         */
        showWhen: ({ index, parentArray }) => {
          const { name, parameters } = parentArray[index];

          return shouldShowValueColumn(name, parameters);
        }
      },
    ]
  },
];
