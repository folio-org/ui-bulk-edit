import moment from 'moment/moment';
import { CONTROL_TYPES,
  getEmailActionsFind,
  getEmailActionsReplace,
  getExpirationActions,
  getPatronActions,
  OPTIONS, getBaseActions, getStatusActions, getPermanentLoanTypeActions, ACTIONS,
  baseFormat } from '../../../../../constants';


export const ACTION_VALUE_KEY = 'name';
export const FIELD_VALUE_KEY = 'value';

export const FIELDS_TYPES = {
  ACTION: 'actions',
  OPTION: 'option',
};

export const getFormattedDate = (value) => {
  const date = `${value} 23:59:59`;
  const format = `${baseFormat}[T]HH:mm:ss`;

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
        ...item,
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

export const getDefaultActions = (option, formatMessage) => {
  const emailActionsFind = getEmailActionsFind(formatMessage);
  const emailActionsReplace = getEmailActionsReplace(formatMessage);
  const patronActions = getPatronActions(formatMessage);
  const expirationActions = getExpirationActions(formatMessage);
  const statusActions = getStatusActions(formatMessage);
  const permanentLoanTypeActions = getPermanentLoanTypeActions(formatMessage);
  const baseActions = getBaseActions(formatMessage);

  const baseActionsInitialVal = baseActions[0].value;

  switch (option) {
    /* USER OPTIONS */
    case OPTIONS.EMAIL_ADDRESS:
      return {
        type: '',
        actions: [
          {
            actionsList: emailActionsFind,
            type: CONTROL_TYPES.INPUT,
            [ACTION_VALUE_KEY]: emailActionsFind[0].value,
            [FIELD_VALUE_KEY]: '',
          },
          {
            actionsList: emailActionsReplace,
            type: CONTROL_TYPES.INPUT,
            [ACTION_VALUE_KEY]: emailActionsReplace[0].value,
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
            actionsList: patronActions,
            type: CONTROL_TYPES.PATRON_GROUP_SELECT,
            [ACTION_VALUE_KEY]: patronActions[0].value,
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
            actionsList: expirationActions,
            type: CONTROL_TYPES.DATE,
            [ACTION_VALUE_KEY]: expirationActions[0].value,
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
            actionsList: baseActions,
            type: CONTROL_TYPES.LOCATION,
            [ACTION_VALUE_KEY]: baseActionsInitialVal,
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
            actionsList: baseActions,
            type: CONTROL_TYPES.LOCATION,
            [ACTION_VALUE_KEY]: baseActionsInitialVal,
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
            actionsList: baseActions,
            type: CONTROL_TYPES.LOCATION,
            [ACTION_VALUE_KEY]: baseActionsInitialVal,
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
            actionsList: baseActions,
            type: CONTROL_TYPES.LOCATION,
            [ACTION_VALUE_KEY]: baseActionsInitialVal,
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
            actionsList: statusActions,
            type: CONTROL_TYPES.STATUS_SELECT,
            [ACTION_VALUE_KEY]: statusActions[0].value,
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
            actionsList: baseActions,
            type: CONTROL_TYPES.LOAN_TYPE,
            [ACTION_VALUE_KEY]: baseActionsInitialVal,
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
            actionsList: permanentLoanTypeActions,
            type: CONTROL_TYPES.LOAN_TYPE,
            [ACTION_VALUE_KEY]: permanentLoanTypeActions[0].value,
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

      // for CLEAR_FIELD 'updated' is not required
      if (act.type === ACTIONS.CLEAR_FIELD) {
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
