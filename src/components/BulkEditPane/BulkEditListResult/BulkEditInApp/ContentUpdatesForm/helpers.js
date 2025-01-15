import moment from 'moment/moment';
import uniqueId from 'lodash/uniqueId';
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

  return `${moment(date).format(format)}.000Z`;
};

export const isAddButtonShown = (index, fields, options) => {
  return index === fields.length - 1 && fields.length !== options.length;
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
            actionsList: electronicAccessActions,
            controlType: () => CONTROL_TYPES.ELECTRONIC_ACCESS_RELATIONSHIP_SELECT,
            [ACTION_VALUE_KEY]: electronicAccessActions[0].value,
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

export const getFilteredFields = (initialFields) => {
  return initialFields.map(f => {
    const uniqOptions = new Set(initialFields.map(i => i.option));

    const optionsExceptCurrent = [...uniqOptions].filter(u => u !== f.option);

    return {
      ...f,
      options: f.options.filter(o => !optionsExceptCurrent.includes(o.value)),
    };
  });
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
