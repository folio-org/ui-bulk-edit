import moment from 'moment/moment';
import {
  CONTROL_TYPES,
  OPTIONS,
  BASE_DATE_FORMAT,
  getReplaceAction,
  getFindAction,
  getBaseActions,
  getSetToTrueAction,
  getSetToFalseAction,
  getPlaceholder,
  FINAL_ACTIONS,
  getMarkAsStuffOnlyAction,
  getRemoveMarkAsStuffOnlyAction,
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

export const getDefaultActions = (option, formatMessage) => {
  const emailActionsFind = [getFindAction(formatMessage)];
  const emailActionsReplace = [getReplaceAction(formatMessage)];
  const patronActions = [getReplaceAction(formatMessage)];
  const expirationActions = [getReplaceAction(formatMessage)];
  const statusActions = [getReplaceAction(formatMessage)];
  const permanentLoanTypeActions = [getReplaceAction(formatMessage)];
  const permanentHoldingsLocation = [getReplaceAction(formatMessage)];
  const allActions = getBaseActions(formatMessage);
  const suppressFromDiscActions = [
    getPlaceholder(formatMessage),
    getSetToTrueAction(formatMessage),
    getSetToFalseAction(formatMessage),
  ];
  const noteMarkActions = [
    getPlaceholder(formatMessage),
    getMarkAsStuffOnlyAction(formatMessage),
    getRemoveMarkAsStuffOnlyAction(formatMessage),
  ];

  const allActionsInitialVal = allActions[0].value;

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
            actionsList: allActions,
            type: CONTROL_TYPES.LOCATION,
            [ACTION_VALUE_KEY]: allActionsInitialVal,
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
            actionsList: permanentHoldingsLocation,
            type: CONTROL_TYPES.LOCATION,
            [ACTION_VALUE_KEY]: permanentHoldingsLocation[0].value,
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
            actionsList: allActions,
            type: CONTROL_TYPES.LOCATION,
            [ACTION_VALUE_KEY]: allActionsInitialVal,
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
            actionsList: suppressFromDiscActions,
            type: CONTROL_TYPES.SUPPRESS_CHECKBOX,
            [ACTION_VALUE_KEY]: suppressFromDiscActions[0].value,
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
            actionsList: allActions,
            type: CONTROL_TYPES.LOCATION,
            [ACTION_VALUE_KEY]: allActionsInitialVal,
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
            actionsList: allActions,
            type: CONTROL_TYPES.LOAN_TYPE,
            [ACTION_VALUE_KEY]: allActionsInitialVal,
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

    case OPTIONS.ACTION_NOTE:
    case OPTIONS.BINDING_NOTE:
    case OPTIONS.CHECK_IN_NOTE:
    case OPTIONS.CHECK_OUT_NOTE:
    case OPTIONS.COPY_NOTE:
    case OPTIONS.ELECTRONIC_BOOKPLATE:
    case OPTIONS.NOTE:
    case OPTIONS.PROVENANCE:
    case OPTIONS.REPRODUCTION:
      return {
        type: '',
        actions: [
          {
            actionsList: noteMarkActions,
            type: CONTROL_TYPES.NOTE_SELECT,
            [ACTION_VALUE_KEY]: noteMarkActions[0].value,
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
