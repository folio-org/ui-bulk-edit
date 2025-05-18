import uniqueId from 'lodash/uniqueId';
import { dayjs } from '@folio/stripes/components';
import {
  CONTROL_TYPES,
  OPTIONS,
  APPROACHES,
  BASE_DATE_FORMAT,
  FINAL_ACTIONS,
  ACTIONS,
  REQUIRES_INITIAL_ACTIONS,
  emailActionsFind,
  emailActionsReplace,
  commonAdditionalActions,
  patronActions,
  expirationActions,
  replaceClearActions,
  permanentHoldingsLocation,
  permanentLoanTypeActions,
  suppressFromDiscActions,
  statusActions,
  noteActions,
  noteActionsWithMarc,
  noteActionsWithDuplicate,
  electronicAccess,
  statisticalCodeActions,
  noteActionsMarc,
  electronicAccessWithFindFullField,
} from '../../../../../constants';
import { getActionParameters } from '../../../../../constants/actionParameters';

export const ACTION_VALUE_KEY = 'name';
export const FIELD_VALUE_KEY = 'value';
export const ACTION_PARAMETERS_KEY = 'parameters';

export const TEMPORARY_LOCATIONS = [OPTIONS.TEMPORARY_LOCATION, OPTIONS.TEMPORARY_HOLDINGS_LOCATION];

const OPTIONS_MAP = {
  [OPTIONS.TEMPORARY_HOLDINGS_LOCATION]: OPTIONS.TEMPORARY_LOCATION,
  [OPTIONS.PERMANENT_HOLDINGS_LOCATION]: OPTIONS.PERMANENT_LOCATION,
};

export const getFormattedDate = (value) => {
  const date = `${value} 23:59:59`;
  const format = `${BASE_DATE_FORMAT}[T]HH:mm:ss`;

  return `${dayjs.utc(date).format(format)}.000Z`;
};

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

export const getDefaultActions = ({
  option,
  options,
  capability,
  approach,
}) => {
  const replaceClearDefaultActions = replaceClearActions();
  const emailDefaultFindActions = emailActionsFind();
  const emailDefaultReplaceActions = emailActionsReplace();
  const patronDefaultActions = patronActions();
  const expirationDefaultActions = expirationActions();
  const holdingsLocationDefaultActions = permanentHoldingsLocation();
  const suppressDefaultActions = suppressFromDiscActions();
  const statisticalCodeDefaultActions = statisticalCodeActions();
  const statusDefaultActions = statusActions();
  const loanDefaultActions = permanentLoanTypeActions();
  const noteDefaultActions = noteActions();
  const noteDefaultActionsMarc = noteActionsMarc();
  const noteWithMarcDefaultActions = noteActionsWithMarc();
  const noteDuplicateDefaultActions = noteActionsWithDuplicate();
  const electronicAccessActions = electronicAccess();
  const electronicAccessFindFullFieldActions = electronicAccessWithFindFullField();

  const replaceClearInitialVal = replaceClearDefaultActions[0].value;

  const isStandardOption = Object.keys(OPTIONS).includes(option);

  const opt = isStandardOption ? option : options.find(({ value }) => value === option)?.type;

  const locationRelatedDefaultActions = {
    type: '',
    actions: [
      null,
      {
        actionsList: replaceClearDefaultActions,
        controlType: () => CONTROL_TYPES.LOCATION,
        [ACTION_VALUE_KEY]: replaceClearInitialVal,
        [FIELD_VALUE_KEY]: '',
      },
    ],
  };

  switch (opt) {
    /* USER OPTIONS */
    case OPTIONS.EMAIL_ADDRESS:
      return {
        type: '',
        actions: [
          {
            actionsList: emailDefaultFindActions,
            controlType: () => CONTROL_TYPES.INPUT,
            [ACTION_VALUE_KEY]: emailDefaultFindActions[0].value,
            [FIELD_VALUE_KEY]: '',
          },
          {
            actionsList: emailDefaultReplaceActions,
            controlType: () => CONTROL_TYPES.INPUT,
            [ACTION_VALUE_KEY]: emailDefaultReplaceActions[0].value,
            [FIELD_VALUE_KEY]: '',
          },
        ],
      };
    case OPTIONS.PATRON_GROUP:
      return {
        type: '',
        actions: [
          null,
          {
            actionsList: patronDefaultActions,
            controlType: () => CONTROL_TYPES.PATRON_GROUP_SELECT,
            [ACTION_VALUE_KEY]: patronDefaultActions[0].value,
            [FIELD_VALUE_KEY]: '',
          },
        ],
      };
    case OPTIONS.EXPIRATION_DATE:
      return {
        type: '',
        actions: [
          null,
          {
            actionsList: expirationDefaultActions,
            controlType: () => CONTROL_TYPES.DATE,
            [ACTION_VALUE_KEY]: expirationDefaultActions[0].value,
            [FIELD_VALUE_KEY]: '',
          },
        ],
      };

    /* HOLDINGS OPTIONS */
    case OPTIONS.TEMPORARY_HOLDINGS_LOCATION:
      return locationRelatedDefaultActions;
    case OPTIONS.PERMANENT_HOLDINGS_LOCATION:
      return {
        type: '',
        actions: [
          null,
          {
            actionsList: holdingsLocationDefaultActions,
            controlType: () => CONTROL_TYPES.LOCATION,
            [ACTION_VALUE_KEY]: holdingsLocationDefaultActions[0].value,
            [FIELD_VALUE_KEY]: '',
          },
        ],
      };

    /* ITEMS OPTIONS */
    case OPTIONS.TEMPORARY_LOCATION:
      return locationRelatedDefaultActions;
    case OPTIONS.SUPPRESS_FROM_DISCOVERY:
      return {
        type: '',
        actions: [
          null,
          {
            actionsList: suppressDefaultActions,
            controlType: () => CONTROL_TYPES.SUPPRESS_CHECKBOX,
            [ACTION_VALUE_KEY]: suppressDefaultActions[0].value,
            [FIELD_VALUE_KEY]: '',
            [ACTION_PARAMETERS_KEY]: getActionParameters(opt, capability),
          },
        ],
      };
    case OPTIONS.STATISTICAL_CODE:
      return {
        type: '',
        actions: [
          null,
          {
            actionsList: statisticalCodeDefaultActions,
            controlType: () => CONTROL_TYPES.STATISTICAL_CODES_SELECT,
            [ACTION_VALUE_KEY]: statisticalCodeDefaultActions[0].value,
            [FIELD_VALUE_KEY]: '',
          },
        ],
      };
    case OPTIONS.STAFF_SUPPRESS:
      return {
        type: '',
        actions: [
          null,
          {
            actionsList: suppressDefaultActions,
            controlType: () => CONTROL_TYPES.SUPPRESS_CHECKBOX,
            [ACTION_VALUE_KEY]: suppressDefaultActions[0].value,
            [FIELD_VALUE_KEY]: '',
          },
        ],
      };
    case OPTIONS.PERMANENT_LOCATION:
      return locationRelatedDefaultActions;
    case OPTIONS.STATUS:
      return {
        type: '',
        actions: [
          null,
          {
            actionsList: statusDefaultActions,
            controlType: () => CONTROL_TYPES.STATUS_SELECT,
            [ACTION_VALUE_KEY]: statusDefaultActions[0].value,
            [FIELD_VALUE_KEY]: '',
          },
        ],
      };
    case OPTIONS.TEMPORARY_LOAN_TYPE:
      return {
        type: '',
        actions: [
          null,
          {
            actionsList: replaceClearDefaultActions,
            controlType: () => CONTROL_TYPES.LOAN_TYPE,
            [ACTION_VALUE_KEY]: replaceClearInitialVal,
            [FIELD_VALUE_KEY]: '',
          },
        ],
      };
    case OPTIONS.PERMANENT_LOAN_TYPE:
      return {
        type: '',
        actions: [
          null,
          {
            actionsList: loanDefaultActions,
            controlType: () => CONTROL_TYPES.LOAN_TYPE,
            [ACTION_VALUE_KEY]: loanDefaultActions[0].value,
            [FIELD_VALUE_KEY]: '',
          },
        ],
      };

    case OPTIONS.ADMINISTRATIVE_NOTE:
      return {
        type: '',
        actions: [
          null,
          {
            actionsList: approach === APPROACHES.MARC
              ? noteDefaultActionsMarc
              : noteDefaultActions,
            controlType: (action) => {
              return action === ACTIONS.CHANGE_TYPE
                ? CONTROL_TYPES.NOTE_SELECT
                : CONTROL_TYPES.TEXTAREA;
            },
            [ACTION_VALUE_KEY]: noteDefaultActions[0].value,
            [FIELD_VALUE_KEY]: '',
          },
        ],
      };

    case OPTIONS.CHECK_IN_NOTE:
    case OPTIONS.CHECK_OUT_NOTE:
      return {
        type: '',
        actions: [
          null,
          {
            actionsList: noteDuplicateDefaultActions,
            controlType: (action) => {
              if (action === ACTIONS.CHANGE_TYPE) {
                return CONTROL_TYPES.NOTE_SELECT;
              }
              if (action === ACTIONS.DUPLICATE) {
                return CONTROL_TYPES.NOTE_DUPLICATE_SELECT;
              } else return CONTROL_TYPES.TEXTAREA;
            },
            [ACTION_VALUE_KEY]: noteDuplicateDefaultActions[0].value,
            [FIELD_VALUE_KEY]: '',
            [ACTION_PARAMETERS_KEY]: getActionParameters(opt, capability),
          },
        ],
      };
    case OPTIONS.INSTANCE_NOTE:
    case OPTIONS.HOLDINGS_NOTE:
    case OPTIONS.ITEM_NOTE:
      return {
        type: '',
        actions: [
          null,
          {
            actionsList: noteWithMarcDefaultActions,
            controlType: (action) => {
              return action === ACTIONS.CHANGE_TYPE
                ? CONTROL_TYPES.NOTE_SELECT
                : CONTROL_TYPES.TEXTAREA;
            },
            [ACTION_VALUE_KEY]: noteWithMarcDefaultActions[0].value,
            [FIELD_VALUE_KEY]: '',
            [ACTION_PARAMETERS_KEY]: getActionParameters(opt, capability),
          },
        ],
      };
    /* ELECTRONIC ACCESS OPTIONS */
    case OPTIONS.ELECTRONIC_ACCESS_URL_RELATIONSHIP:
      return {
        type: '',
        actions: [
          null,
          {
            actionsList: electronicAccessFindFullFieldActions,
            controlType: () => CONTROL_TYPES.ELECTRONIC_ACCESS_RELATIONSHIP_SELECT,
            [ACTION_VALUE_KEY]: electronicAccessFindFullFieldActions[0].value,
            [FIELD_VALUE_KEY]: '',
          },
        ],
      };
    case OPTIONS.ELECTRONIC_ACCESS_LINK_TEXT:
    case OPTIONS.ELECTRONIC_ACCESS_MATERIALS_SPECIFIED:
    case OPTIONS.ELECTRONIC_ACCESS_URI:
    case OPTIONS.ELECTRONIC_ACCESS_URL_PUBLIC_NOTE:
      return {
        type: '',
        actions: [
          null,
          {
            actionsList: electronicAccessActions,
            controlType: () => CONTROL_TYPES.TEXTAREA,
            [ACTION_VALUE_KEY]: electronicAccessActions[0].value,
            [FIELD_VALUE_KEY]: '',
          },
        ],
      };

    default:
      return {
        type: null,
        actions: [],
      };
  }
};

export const isContentUpdatesFormValid = (contentUpdates) => {
  return contentUpdates?.every(({ actions, option }) => {
    return option && actions?.every(act => {
      const { type, updated, initial = null } = act;

      // for FINAL_ACTIONS 'updated' is not required
      if (FINAL_ACTIONS.includes(type)) {
        return type;
      }

      // for some cases only initial value is required (e.g. for 'FIND_AND_REMOVE_THESE' action)
      if (REQUIRES_INITIAL_ACTIONS.includes(type)) {
        return type && initial;
      }

      // if initial value isn't null, it should be a part of validation
      if (initial !== null) {
        return type && updated && initial;
      }

      return type && updated;
    });
  });
};

export const isMarcContentUpdatesFormValid = (errors) => {
  return Object.keys(errors).length === 0;
};

export const getStatisticalCodesIndexes = (fields) => {
  return fields.reduce((acc, { option }, index) => {
    if (option === OPTIONS.STATISTICAL_CODE) {
      acc.push(index);
    }

    return acc;
  }, []);
};

export const getActionIndex = (fields, action) => fields.findIndex(({ option, actionsDetails }) => {
  return option === OPTIONS.STATISTICAL_CODE && actionsDetails.actions.filter(Boolean)
    .some(({ name }) => name === action);
});

/**
 * Checks if there is at least one field with the STATISTICAL_CODE option that contains
 * either an ADD_TO_EXISTING or REMOVE_SOME action.
 */
const hasAddOrRemoveFieldAction = (fields) => {
  const addActionIndex = getActionIndex(fields, ACTIONS.ADD_TO_EXISTING);
  const removeActionIndex = getActionIndex(fields, ACTIONS.REMOVE_SOME);

  return addActionIndex !== -1 || removeActionIndex !== -1;
};

/**
 * Determines the additional options that should be applied based on the provided fields.
 * If the number of STATISTICAL_CODE fields is not exactly 2 and at least one STATISTICAL_CODE field
 * has an ADD_TO_EXISTING or REMOVE_SOME action, this function returns an array containing STATISTICAL_CODE.
 * It will be used to show/hide the extra STATISTICAl_CODE option in options list.
 */
export const getAdditionalOptions = (fields) => {
  const statisticalCodeFields = fields.filter(({ option }) => option === OPTIONS.STATISTICAL_CODE);
  const hasAddOrRemove = hasAddOrRemoveFieldAction(fields);

  return statisticalCodeFields.length !== 2 && hasAddOrRemove ? [OPTIONS.STATISTICAL_CODE] : [];
};

/**
 * Filters and updates the provided fields by marking options as hidden based on other fields’ options.
 * For each field, it computes the unique set of options available among all fields and then hides
 * options that are present in other fields – except for those that are returned by getAdditionalOptions.
 */
export const getFilteredFields = (initialFields) => {
  return initialFields.map(f => {
    const uniqOptions = new Set(initialFields.map(i => i.option));

    const optionsExceptCurrent = [...uniqOptions].filter(u => u !== f.option && !getAdditionalOptions(initialFields).includes(u));

    return {
      ...f,
      options: f.options.map(o => ({ ...o, hidden: optionsExceptCurrent.includes(o.value) })),
    };
  });
};

/**
 * Determines whether an "add" button should be shown for fields.
 * The add button is shown if:
 *  - The provided index corresponds to the last field in the array, and
 *  - The total number of fields is less than the allowed maximum.
 * The allowed maximum is defined as the length of the base options plus 1 if any STATISTICAL_CODE field
 * contains an ADD_TO_EXISTING or REMOVE_SOME action as exceptional case.
 */
export const isAddButtonShown = (index, fields, options) => {
  const additionalFieldsCount = hasAddOrRemoveFieldAction(fields) ? 1 : 0;
  const maxFieldsLength = options.length + additionalFieldsCount;
  return index === fields.length - 1 && fields.length < maxFieldsLength;
};

/**
 * Processes an array of fields using rules for STATISTICAL_CODE.
 * - Returns fields unchanged if `option` is not STATISTICAL_CODE.
 * - When `value` is REMOVE_ALL or there are both ADD_TO_EXISTING and REMOVE_SOME actions:
 *    - Removes any STATISTICAL_CODE field not at `rowIndex`.
 *    - Sets `hidden` to true for STATISTICAL_CODE options.
 */
export const getFieldsWithRules = ({ fields, option, rowIndex }) => {
  if (option !== OPTIONS.STATISTICAL_CODE) return fields;

  return fields.map((field, i) => {
    const maxFieldsLength = fields[0].options.length + 1; // +1 for extra STATISTICAL_CODE
    const isCurrentRow = i === rowIndex;
    const firstEmptyOptionIndex = fields.findIndex(({ option: optionValue }) => !optionValue);
    const isFirstEmpty = fields.length === maxFieldsLength && i === firstEmptyOptionIndex;
    const isStatisticalCode = field.option === OPTIONS.STATISTICAL_CODE;
    const removeActionIndex = getActionIndex(fields, ACTIONS.REMOVE_SOME);
    const addActionIndex = getActionIndex(fields, ACTIONS.ADD_TO_EXISTING);
    const removeAllIndex = getActionIndex(fields, ACTIONS.REMOVE_ALL);
    const statisticalCodesIndexes = getStatisticalCodesIndexes(fields);
    const hasMaxStatisticalCodes = statisticalCodesIndexes.length === 2;
    const hasAddAndRemove = removeActionIndex !== -1 && addActionIndex !== -1;
    const hasRemoveAll = removeAllIndex !== -1;

    if (hasRemoveAll && (isStatisticalCode || isFirstEmpty) && !isCurrentRow) {
      return null; // Remove this item
    }

    const isOptionHidden = (o) => {
      if (o.value === OPTIONS.STATISTICAL_CODE) {
        // If there is a REMOVE_ALL action, hide the STATISTICAL_CODE option for all other fields
        if (hasRemoveAll) {
          return i !== removeAllIndex;
          // If there are REMOVE_SOME and ADD_TO_EXISTING actions, hide the STATISTICAL_CODE option for all other fields
        } else if (hasAddAndRemove) {
          return i !== removeActionIndex && i !== addActionIndex;
          // If there are two STATISTICAL_CODE fields, hide the STATISTICAL_CODE option for all other fields
        } else if (hasMaxStatisticalCodes) {
          return statisticalCodesIndexes.every(index => index !== i);
        } else {
          return false;
        }
      }

      return o.hidden;
    };

    return {
      ...field,
      options: field.options.map(o => ({
        ...o,
        hidden: isOptionHidden(o),
      })),
    };
  }).filter(Boolean);
};

/**
 * Normalizes the rules for fields having the STATISTICAL_CODE option.
 * This function extracts each STATISTICAL_CODE field’s selected actions and available actions
 * (from its actionsDetails), then adjusts the available actions for fields that are not the primary
 * (first) field having either an ADD_TO_EXISTING or REMOVE_SOME action.
 * The result is returned as an object keyed by the original field indices.
 */
export const getNormalizedFieldsRules = (fields) => {
  const statisticalCodeFields = fields.reduce((acc, field, index) => {
    const actions = field.actionsDetails.actions.filter(Boolean);

    if (field.option === OPTIONS.STATISTICAL_CODE) {
      acc.push({
        selectedActions: actions.map(({ name }) => name),
        availableActions: actions[0]?.actionsList.map(({ value }) => value),
        index,
      });
    }

    return acc;
  }, []);

  const addActionIndex = statisticalCodeFields.findIndex(({ selectedActions }) => {
    return selectedActions.includes(ACTIONS.ADD_TO_EXISTING);
  });

  const removeActionIndex = statisticalCodeFields.findIndex(({ selectedActions }) => {
    return selectedActions.includes(ACTIONS.REMOVE_SOME);
  });

  return statisticalCodeFields.reduce((acc, elem, index) => {
    let item = elem;

    if (addActionIndex !== -1 && addActionIndex !== index) {
      item = {
        ...item,
        availableActions: item.availableActions.filter((action) => {
          return action === ACTIONS.REMOVE_SOME || !action;
        })
      };
    }

    if (removeActionIndex !== -1 && removeActionIndex !== index) {
      item = {
        ...item,
        availableActions: item.availableActions.filter((action) => {
          return action === ACTIONS.ADD_TO_EXISTING || !action;
        })
      };
    }

    acc[elem.index] = item;

    return acc;
  }, {});
};

export const getExtraActions = (option, action) => {
  switch (`${option}-${action}`) {
    case `${OPTIONS.ITEM_NOTE}-${ACTIONS.FIND}`:
    case `${OPTIONS.ADMINISTRATIVE_NOTE}-${ACTIONS.FIND}`:
    case `${OPTIONS.ELECTRONIC_ACCESS_URI}-${ACTIONS.FIND}`:
    case `${OPTIONS.ELECTRONIC_ACCESS_LINK_TEXT}-${ACTIONS.FIND}`:
    case `${OPTIONS.ELECTRONIC_ACCESS_MATERIALS_SPECIFIED}-${ACTIONS.FIND}`:
    case `${OPTIONS.CHECK_IN_NOTE}-${ACTIONS.FIND}`:
    case `${OPTIONS.CHECK_OUT_NOTE}-${ACTIONS.FIND}`:
    case `${OPTIONS.HOLDINGS_NOTE}-${ACTIONS.FIND}`:
    case `${OPTIONS.INSTANCE_NOTE}-${ACTIONS.FIND}`:
    case `${OPTIONS.ELECTRONIC_ACCESS_URL_PUBLIC_NOTE}-${ACTIONS.FIND}`:
      return [{
        actionsList: commonAdditionalActions(),
        controlType: () => CONTROL_TYPES.TEXTAREA,
        [ACTION_VALUE_KEY]: commonAdditionalActions()[0].value,
        [FIELD_VALUE_KEY]: '',
      }];

    case `${OPTIONS.ELECTRONIC_ACCESS_URL_RELATIONSHIP}-${ACTIONS.FIND}`:
      return [{
        actionsList: commonAdditionalActions(),
        controlType: () => CONTROL_TYPES.ELECTRONIC_ACCESS_RELATIONSHIP_SELECT,
        [ACTION_VALUE_KEY]: commonAdditionalActions()[0].value,
        [FIELD_VALUE_KEY]: '',
      }];

    default:
      return [];
  }
};

export const getLabelByValue = (items, targetValue) => {
  return items?.find((labeledValue) => labeledValue.value === targetValue)?.label;
};

export const sortWithoutPlaceholder = (array) => {
  if (!array.length) return [];

  const [placeholder, ...rest] = array;

  return [placeholder, ...rest.sort((a, b) => a.label.localeCompare(b.label))];
};

export const getMappedContentUpdates = (fields, options) => fields.map(({
  parameters, tenants, option, actionsDetails: { actions }
}) => {
  const [initial, updated] = actions.map(action => {
    if (Array.isArray(action?.value)) {
      return action.value.map(item => item?.value).join(',');
    }

    return action?.value || null;
  });
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

export const getFieldTemplate = (options, capability, approach) => {
  return ({
    id: uniqueId(),
    options,
    option: '',
    tenants: [],
    actionsDetails: getDefaultActions({
      option: '',
      capability,
      approach,
      options,
    }),
  });
};
