import moment from 'moment/moment';
import {
  CONTROL_TYPES,
  OPTIONS,
  BASE_DATE_FORMAT,
  FINAL_ACTIONS,
  ACTIONS,
  emailActionsFind,
  emailActionsReplace,
  patronActions,
  expirationActions,
  replaceClearActions,
  permanentHoldingsLocation,
  permanentLoanTypeActions,
  suppressFromDiscActions,
  statusActions,
  noteActions, CAPABILITIES, noteActionsWithMark,
} from '../../../../../constants';

export const ACTION_VALUE_KEY = 'name';
export const FIELD_VALUE_KEY = 'value';
export const WITH_ITEMS_VALUE_KEY = 'withItems';

export const FIELDS_TYPES = {
  ACTION: 'actions',
  OPTION: 'option',
};

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
  return index === fields.length - 1 && fields.length !== options.length - 1;
};

export const getContentUpdatesBody = ({ bulkOperationId, contentUpdates, totalRecords }) => {
  const bulkOperationRules = contentUpdates.reduce((acc, item) => {
    const formattedItem = () => {
      const isExpirationDate = item.option === OPTIONS.EXPIRATION_DATE;

      return {
        option: OPTIONS_MAP[item.option] || item.option,
        actions: item.actions.map(action => ({
          ...action,
          updated: isExpirationDate ? getFormattedDate(action.updated) : action.updated,
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

export const getDefaultActions = (option, options, formatMessage) => {
  const replaceClearDefaultActions = replaceClearActions(formatMessage);
  const emailDefaultFindActions = emailActionsFind(formatMessage);
  const emailDefaultReplaceActions = emailActionsReplace(formatMessage);
  const patronDefaultActions = patronActions(formatMessage);
  const expirationDefaultActions = expirationActions(formatMessage);
  const holdingsLocationDefaultActions = permanentHoldingsLocation(formatMessage);
  const suppressDefaultActions = suppressFromDiscActions(formatMessage);
  const statusDefaultActions = statusActions(formatMessage);
  const loanDefaultActions = permanentLoanTypeActions(formatMessage);
  const noteDefaultActions = noteActions(formatMessage);
  const noteWithMarkDefaultActions = noteActionsWithMark(formatMessage);

  const replaceClearInitialVal = replaceClearDefaultActions[0].value;

  const isStandardOption = Object.keys(OPTIONS).includes(option);

  const opt = isStandardOption ? option : options.find(({ value }) => value === option)?.type;

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
      return {
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
      return {
        type: '',
        actions: [
          null,
          {
            actionsList: replaceClearDefaultActions,
            type: CONTROL_TYPES.LOCATION,
            [ACTION_VALUE_KEY]: replaceClearInitialVal,
            [FIELD_VALUE_KEY]: '',
          },
        ],
      };
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
          },
        ],
      };
    case OPTIONS.PERMANENT_LOCATION:
      return {
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
            actionsList: noteDefaultActions,
            controlType: () => CONTROL_TYPES.TEXTAREA,
            [ACTION_VALUE_KEY]: noteDefaultActions[0].value,
            [FIELD_VALUE_KEY]: '',
          },
        ],
      };

    case OPTIONS.ITEM_NOTE:
    case OPTIONS.CHECK_IN_NOTE:
    case OPTIONS.CHECK_OUT_NOTE:
      return {
        type: '',
        actions: [
          null,
          {
            actionsList: noteWithMarkDefaultActions,
            controlType: (action) => {
              return action === ACTIONS.CHANGE_NOTE_TYPE
                ? CONTROL_TYPES.NOTE_SELECT
                : CONTROL_TYPES.TEXTAREA;
            },
            [ACTION_VALUE_KEY]: noteWithMarkDefaultActions[0].value,
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
    return option && actions.every(act => {
      const initial = act.initial ?? null;

      // for FINAL_ACTIONS 'updated' is not required
      if (FINAL_ACTIONS.includes(act.type)) {
        return act.type;
      }

      // if initial value isn't null, it should be a part of validation
      if (initial !== null) {
        return act.type && act.updated && act.initial;
      }

      return act.type && act.updated;
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

export const getActionType = (action, option, capability) => {
  const actionName = action?.name;
  const isSuppressHolding = capability === CAPABILITIES.HOLDING && option === OPTIONS.SUPPRESS_FROM_DISCOVERY;
  const isSetTrue = actionName === ACTIONS.SET_TO_TRUE;
  const isSetToFalse = actionName === ACTIONS.SET_TO_FALSE;

  if (isSuppressHolding && isSetTrue && action?.[WITH_ITEMS_VALUE_KEY]) {
    return ACTIONS.SET_TO_TRUE_INCLUDING_ITEMS;
  }

  if (isSuppressHolding && isSetToFalse && action?.[WITH_ITEMS_VALUE_KEY]) {
    return ACTIONS.SET_TO_FALSE_INCLUDING_ITEMS;
  }

  return actionName ?? null;
};
