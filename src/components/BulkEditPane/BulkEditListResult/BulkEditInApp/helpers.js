import { dayjs } from '@folio/stripes/components';
import { uniqueId } from 'lodash';

import {
  OPTIONS,
  BASE_DATE_FORMAT,
  FINAL_ACTIONS,
  ACTIONS,
  NOTES_PARAMETERS_KEYS,
  GRANULAR_ACTIONS_MAP,
  PARAMETERS_KEYS,
  BOOLEAN_PARAMETERS_KEYS,
  getRemoveSomeAction,
  getPlaceholder,
  getAddAction
} from '../../../../constants';

export const TEMPORARY_LOCATIONS = [
  OPTIONS.TEMPORARY_LOCATION,
  OPTIONS.TEMPORARY_HOLDINGS_LOCATION
];

const OPTIONS_MAP = {
  [OPTIONS.TEMPORARY_HOLDINGS_LOCATION]: OPTIONS.TEMPORARY_LOCATION,
  [OPTIONS.PERMANENT_HOLDINGS_LOCATION]: OPTIONS.PERMANENT_LOCATION,
};

/**
 * Retrieves the type of option based on its value and available options.
 * Existing type means that the value is one of the NOTES options.
 *
 * @param value - can be Enum option value or note type id
 * @param allOptions - array of all options
 * @returns {string} return one of the OPTIONS, initial or determined by note type id
 */
export const getOptionType = (value, allOptions) => {
  return allOptions.find(o => o.value === value)?.type || value;
};

/**
 * Formats a simple date string into a UTC timestamp ending at 23:59:59.000Z
 *
 * @param {string} value - The date string in base format (e.g. 'YYYY-MM-DD').
 * @returns {string} The formatted UTC timestamp (e.g. 'YYYY-MM-DD[T]HH:mm:ss.000Z').
 */
export const getFormattedDate = (value) => {
  const date = `${value} 23:59:59`;
  const format = `${BASE_DATE_FORMAT}[T]HH:mm:ss`;

  return `${dayjs.utc(date).format(format)}.000Z`;
};

/**
 * Builds the request payload for bulk content update operations.
 *
 * @param {Object} params
 * @param {string} params.bulkOperationId - Identifier for the bulk operation.
 * @param {Array} params.contentUpdates - Array of rule update objects.
 * @param {number} params.totalRecords - Total number of records affected.
 * @returns {Object} Payload containing formatted rules and record count.
 */
export const getContentUpdatesBody = ({ bulkOperationId, contentUpdates, totalRecords }) => {
  const bulkOperationRules = contentUpdates.reduce((acc, item) => {
    const formattedItem = () => {
      const isExpirationDate = item.option === OPTIONS.EXPIRATION_DATE;

      return {
        option: OPTIONS_MAP[item.option] || item.option,
        tenants: item?.tenants,
        actions: item.actions.map(action => ({
          ...action,
          updated: isExpirationDate ? getFormattedDate(action.updated) : action.updated,
          tenants: action?.tenants
        })),
      };
    };

    acc.push({
      bulkOperationId,
      rule_details: formattedItem(),
    });

    return acc;
  }, []);

  return {
    bulkOperationRules,
    totalRecords,
  };
};

/**
 * Maps rule details from the backend into a source format that can be used
 * as the initial state of a form.
 *
 * @param {Array} ruleDetails - Array of rule detail objects from the backend.
 * @returns {Array} Array of formatted rule objects ready to be used as initial state of form.
 */
export const ruleDetailsToSource = (ruleDetails) => {
  return ruleDetails?.map(rule => {
    const { option, tenants, actions } = rule;
    const action = actions[0] || {};
    const noteParam = action.parameters?.find(param => NOTES_PARAMETERS_KEYS.includes(param.key));
    const [firstAction, secondAction] = GRANULAR_ACTIONS_MAP[action.type] || [action.type];
    const mappedParameters = action.parameters?.map(param => {
      if (BOOLEAN_PARAMETERS_KEYS.includes(param.key)) {
        return {
          ...param,
          ...(param.key === PARAMETERS_KEYS.STAFF_ONLY ? { onlyForActions: [ACTIONS.ADD_TO_EXISTING] } : {}), // staff only parameter is only for ADD_TO_EXISTING action
          value: param.value === 'true' || param.value === true, // Ensure boolean values are true/false as BE is sending strings
        };
      }

      return param;
    });

    return {
      id: uniqueId(),
      option: noteParam?.value || option,
      tenants,
      actionsDetails: {
        actions: [
          {
            name: firstAction,
            value: action.initial || action.updated,
            parameters: mappedParameters,
            tenants: action.tenants,
          },
          ...(secondAction ? [{
            name: secondAction,
            value: action.updated,
            tenants: action.tenants,
          }] : [])
        ]
      },
    };
  });
};

/**
 * Finds the index of a statistical code action in a list of fields.
 *
 * @param {Array} fields - Array of field objects to search through.
 * @param {string} action - The action name to find (e.g. 'REMOVE_ALL').
 * @returns {number} Index of the matching field, or -1 if not found.
 */
export const getStatisticalCodeActionIndex = (fields, action) => fields.findIndex(({ option, actionsDetails }) => option === OPTIONS.STATISTICAL_CODE &&
    actionsDetails.actions.some(({ name }) => name === action));

/**
 * Applies filtering rules to determine which fields remain visible
 * when removing or altering statistical code entries.
 *
 * @param {Object} params
 * @param {string} params.action - The action to apply.
 * @param {string} params.option - The field option being targeted.
 * @param {string} params.rowId - The ID of the current row.
 * @param {Array} params.fields - All field definitions.
 * @returns {Array} Filtered array of fields to keep.
 */
export const getFieldsWithRules = ({ action, option, rowId, fields }) => {
  if (option === OPTIONS.STATISTICAL_CODE && action === ACTIONS.REMOVE_ALL) {
    return fields.filter(f => f.id === rowId || f.option !== OPTIONS.STATISTICAL_CODE);
  }

  return fields;
};

/**
 * Determines available action options based on statistical code rules
 * and other fields' current state.
 *
 * @param {Object} params
 * @param {Object} params.row - The row being edited.
 * @param {string} params.option - Field option type.
 * @param {Array} params.actions - Original list of actions.
 * @param {Array} params.fields - All field definitions.
 * @returns {Array} Adjusted list of actions to show.
 */
export const getActionsWithRules = ({ row, option, actions, fields }) => {
  const addActionIndex = getStatisticalCodeActionIndex(fields, ACTIONS.ADD_TO_EXISTING);
  const removeActionIndex = getStatisticalCodeActionIndex(fields, ACTIONS.REMOVE_SOME);
  const currentIndex = fields.findIndex(field => field.id === row.id);

  if (option === OPTIONS.STATISTICAL_CODE) {
    if (addActionIndex !== -1 && addActionIndex !== currentIndex) {
      return [
        getPlaceholder(),
        getRemoveSomeAction()
      ];
    }

    if (removeActionIndex !== -1 && removeActionIndex !== currentIndex) {
      return [
        getPlaceholder(),
        getAddAction()
      ];
    }
  }

  return actions;
};

/**
 * Filters available options for each row based on current selections and rules,
 * ensuring limits on options are counted, and they are not visible when selected in prev rows.
 *
 * @param {Object} params
 * @param {Array} params.fields - Currently selected fields.
 * @param {Array} params.options - All possible options.
 * @param {Object} params.item - The field item being evaluated.
 * @returns {Object} Object containing maxRowsCount and filteredOptions list.
 */
export const getOptionsWithRules = ({ fields, options, item }) => {
  const removeAllIndex = getStatisticalCodeActionIndex(fields, ACTIONS.REMOVE_ALL);
  const addIndex = getStatisticalCodeActionIndex(fields, ACTIONS.ADD_TO_EXISTING);
  const removeSomeIndex = getStatisticalCodeActionIndex(fields, ACTIONS.REMOVE_SOME);
  const hasAddOrRemoveSome = addIndex !== -1 || removeSomeIndex !== -1;

  const usedOptions = fields.reduce((acc, field) => {
    const noteParam = field.parameters?.find(param => NOTES_PARAMETERS_KEYS.includes(param.key));

    if (noteParam) {
      acc.push(noteParam.value);
    } else {
      acc.push(field.option);
    }

    return acc;
  }, []);

  const instancesMap = {
    [OPTIONS.STATISTICAL_CODE]: removeAllIndex !== -1 || !hasAddOrRemoveSome ? 1 : 2
  };

  const filteredOptions = options.filter(opt => {
    const usedLength = usedOptions.filter(used => {
      return opt.parameters?.map(p => p.value).includes(used) || used === opt.value;
    }).length;

    const limit = instancesMap[opt.value] ?? 1;

    return usedLength < limit
      || (opt.value === item.option || opt.parameters?.map(p => p.value).includes(item.option));
  });

  const maxRowsCount = options.length -
    Object.keys(instancesMap).length +
    Object.values(instancesMap).reduce((acc, val) => acc + val, 0);

  return {
    maxRowsCount,
    filteredOptions,
  };
};

/**
 * Returns a default preselected value for duplicate of check-in and check-out notes.
 *
 * @param {string} option - Field option (e.g. check-in or check-out note).
 * @param {string} action - Action name (e.g. 'DUPLICATE').
 * @returns {string} The opposite note option or empty string if none.
 */
export const getPreselectedValue = (option, action) => {
  if (option === OPTIONS.CHECK_IN_NOTE && action === ACTIONS.DUPLICATE) {
    return OPTIONS.CHECK_OUT_NOTE;
  }

  if (option === OPTIONS.CHECK_OUT_NOTE && action === ACTIONS.DUPLICATE) {
    return OPTIONS.CHECK_IN_NOTE;
  }

  return '';
};


/**
 * Returns preselected parameters based on the action type.
 * If the action is to set a boolean value, it updates the value
 * @param action
 * @param params
 * @returns {Array} Array of parameters with updated values.
 */
export const getPreselectedParams = (action, params = []) => {
  if ([ACTIONS.SET_TO_TRUE, ACTIONS.SET_TO_FALSE].includes(action)) {
    return params.map((param) => ({ ...param, value: action === ACTIONS.SET_TO_TRUE }));
  }

  return params;
};

/**
 * Finds the display label for a given option value from a list.
 *
 * @param {Array} items - List of objects with `value` and `label`.
 * @param {string} targetValue - The value to look up.
 * @returns {string|undefined} Corresponding label or undefined if not found.
 */
export const getLabelByValue = (items, targetValue) => {
  return items?.find((labeledValue) => labeledValue.value === targetValue)?.label;
};

/**
 * Sorts an array of labeled items alphabetically by label, preserving
 * the first element (often a placeholder) in place.
 *
 * @param {Array} array - List of objects with `label` property.
 * @returns {Array} New sorted array with the first element unchanged.
 */
export const sortWithoutPlaceholder = (array) => {
  if (!array.length) return [];

  const [placeholder, ...rest] = array;

  return [placeholder, ...rest.sort((a, b) => a.label.localeCompare(b.label))];
};

/**
 * Maps internal field representations into payload entries for
 * content updates, merging actions and parameters.
 *
 * @param {Array} fields - List of field objects with actionsDetails.
 * @param {Array} options - List of reference option definitions.
 * @returns {Array} Array of formatted update objects ready for submission.
 */
export const getMappedContentUpdates = (fields, options) => fields.map((field) => {
  const { parameters, tenants, option, actionsDetails: { actions } } = field;

  if (!actions) return field;

  const [firstAction, secondAction] = actions.map(action => {
    if (Array.isArray(action?.value)) {
      return {
        ...action,
        value: action.value.map(item => item?.value).join(',')
      };
    }

    return {
      ...action,
      value: action?.value || null,
    };
  });

  const hasBothValues = firstAction && secondAction;
  const hasOnlyFirstAction = firstAction && !secondAction;
  const initial = hasOnlyFirstAction ? null : firstAction.value;
  const updated = hasBothValues ? secondAction.value : firstAction.value;

  const actionTenants = actions.map(action => action?.tenants);
  const sourceOption = options.find(o => o.value === option);
  const optionType = sourceOption?.type;
  const mappedOption = optionType || option; // if option has type, use it, otherwise use option value (required for ITEM_NOTE cases)
  // generate action type key with '_' delimiter
  const typeKey = actions
    .filter(Boolean)
    .map(action => action?.name ?? null).join('_');

  const actionParameters = actions.find(action => Boolean(action?.parameters))?.parameters;
  const filteredTenants = actionTenants.filter(Boolean);
  // final action is the action which doesn't require any additional data after it
  const isSecondActionFinal = FINAL_ACTIONS.includes(actions[1]?.name);

  const activeTenants = isSecondActionFinal || filteredTenants.length === 1
    ? filteredTenants.flat()
    : filteredTenants
      .flat()
      .filter((tenant, index, array) => array.indexOf(tenant) !== index);

  // That tenants array need when we use find and replace action with two different action values
  const updatedTenants = filteredTenants[1] || [];
  const type = ACTIONS[typeKey];

  return {
    option: mappedOption,
    tenants: tenants?.filter(Boolean),
    actions: [{
      type,
      initial,
      updated,
      tenants: activeTenants,
      updated_tenants: updatedTenants,
      parameters: [
        ...(parameters || []),
        ...(actionParameters || []),
      ],
    }],
  };
});

/**
 * Checks if the value column should be displayed for a given action name and parameters.
 * @param {string} name
 * @param {Array} parameters
 * @returns {boolean}
 */
export const shouldShowValueColumn = (name, parameters) => {
  const filteredParams = parameters?.filter(param => !(param.onlyForActions && !param.onlyForActions.includes(name))
    && !NOTES_PARAMETERS_KEYS.includes(param.key));

  return name && (
    !FINAL_ACTIONS.includes(name)
    || filteredParams?.length > 0
  );
};


/**
 * Creates a blank folio field template structure, optionally with an ID.
 *
 * @param {string} [id] - Optional unique identifier for the field row.
 * @returns {Object} New field object with defaults for option, tenants, and actions.
 */
export const folioFieldTemplate = (id) => ({
  ...(id ? { id } : {}),
  option: '',
  tenants: [],
  actionsDetails: []
});
