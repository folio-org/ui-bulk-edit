import {
  OPTIONS,
  ACTIONS,
  APPROACHES,
  CONTROL_TYPES,
  electronicAccess,
  electronicAccessWithFindFullField,
  emailActionsFind,
  expirationActions,
  noteActions,
  noteActionsMarc,
  noteActionsWithDuplicate,
  noteActionsWithMarc,
  patronActions,
  permanentHoldingsLocation,
  permanentLoanTypeActions,
  replaceClearActions,
  statisticalCodeActions,
  statusActions,
  suppressFromDiscActions, commonAdditionalActions
} from '../../../../constants';
import { getActionParameters } from '../../../../constants/actionParameters';

const twoEmpty = {
  actions: [
    { name: '', value: '' },
    { name: '', value: '' },
  ]
};

const secondOnly = {
  actions: [
    { name: '', value: '' },
  ]
};

const firstActionConfig = {
  [OPTIONS.EMAIL_ADDRESS]: {
    actions: emailActionsFind(),
    controlType: CONTROL_TYPES.INPUT,
    initialState: twoEmpty,
  },

  [OPTIONS.PATRON_GROUP]: {
    actions: patronActions(),
    controlType: CONTROL_TYPES.PATRON_GROUP_SELECT,
    initialState: secondOnly,
  },

  [OPTIONS.EXPIRATION_DATE]: {
    actions: expirationActions(),
    controlType: CONTROL_TYPES.DATE,
    initialState: secondOnly,
  },

  [OPTIONS.TEMPORARY_HOLDINGS_LOCATION]: {
    actions: replaceClearActions(),
    controlType: CONTROL_TYPES.LOCATION,
    initialState: twoEmpty,
  },
  [OPTIONS.PERMANENT_HOLDINGS_LOCATION]: {
    actions: permanentHoldingsLocation(),
    controlType: CONTROL_TYPES.LOCATION,
    initialState: secondOnly,
  },

  [OPTIONS.TEMPORARY_LOCATION]: {
    actions: replaceClearActions(),
    controlType: CONTROL_TYPES.LOCATION,
    initialState: twoEmpty,
  },
  [OPTIONS.PERMANENT_LOCATION]: {
    actions: replaceClearActions(),
    controlType: CONTROL_TYPES.LOCATION,
    initialState: twoEmpty,
  },

  [OPTIONS.TEMPORARY_LOAN_TYPE]: {
    actions: replaceClearActions(),
    controlType: CONTROL_TYPES.LOAN_TYPE,
    initialState: secondOnly,
  },
  [OPTIONS.PERMANENT_LOAN_TYPE]: {
    actions: permanentLoanTypeActions(),
    controlType: CONTROL_TYPES.LOAN_TYPE,
    initialState: secondOnly,
  },

  [OPTIONS.SUPPRESS_FROM_DISCOVERY]: {
    actions: suppressFromDiscActions(),
    controlType: CONTROL_TYPES.SUPPRESS_CHECKBOX,
    initialState: recordType => ({
      actions: [
        {
          name: '',
          value: '',
          parameters: getActionParameters(OPTIONS.SUPPRESS_FROM_DISCOVERY, recordType),
        },
      ]
    }),
  },
  [OPTIONS.STAFF_SUPPRESS]: {
    actions: suppressFromDiscActions(),
    controlType: CONTROL_TYPES.SUPPRESS_CHECKBOX,
    initialState: recordType => ({
      actions: [
        {
          name: '',
          value: '',
          parameters: getActionParameters(OPTIONS.STAFF_SUPPRESS, recordType),
        },
      ]
    }),
  },

  [OPTIONS.STATISTICAL_CODE]: {
    actions: statisticalCodeActions(),
    controlType: CONTROL_TYPES.STATISTICAL_CODES_SELECT,
    initialState: secondOnly,
  },
  [OPTIONS.STATUS]: {
    actions: statusActions(),
    controlType: CONTROL_TYPES.STATUS_SELECT,
    initialState: secondOnly,
  },

  [OPTIONS.ADMINISTRATIVE_NOTE]: {
    actions: recordType => {
      return recordType === APPROACHES.MARC
        ? noteActionsMarc()
        : noteActions();
    },
    controlType: action => (action === ACTIONS.CHANGE_TYPE
      ? CONTROL_TYPES.NOTE_SELECT
      : CONTROL_TYPES.TEXTAREA),
    initialState: secondOnly,
  },

  [OPTIONS.CHECK_IN_NOTE]: {
    actions: noteActionsWithDuplicate(),
    controlType: action => {
      if (action === ACTIONS.CHANGE_TYPE) return CONTROL_TYPES.NOTE_SELECT;
      if (action === ACTIONS.DUPLICATE) return CONTROL_TYPES.NOTE_DUPLICATE_SELECT;
      return CONTROL_TYPES.TEXTAREA;
    },
    initialState: recordType => ({
      actions: [
        {
          name: '',
          value: '',
          parameters: getActionParameters(OPTIONS.CHECK_IN_NOTE, recordType),
        },
      ]
    }),
  },
  [OPTIONS.CHECK_OUT_NOTE]: {
    actions: noteActionsWithDuplicate(),
    controlType: action => {
      if (action === ACTIONS.CHANGE_TYPE) return CONTROL_TYPES.NOTE_SELECT;
      if (action === ACTIONS.DUPLICATE) return CONTROL_TYPES.NOTE_DUPLICATE_SELECT;
      return CONTROL_TYPES.TEXTAREA;
    },
    initialState: recordType => ({
      actions: [
        {
          name: '',
          value: '',
          parameters: getActionParameters(OPTIONS.CHECK_OUT_NOTE, recordType),
        },
      ]
    }),
  },

  [OPTIONS.INSTANCE_NOTE]: {
    actions: noteActionsWithMarc(),
    controlType: action => (action === ACTIONS.CHANGE_TYPE
      ? CONTROL_TYPES.NOTE_SELECT
      : CONTROL_TYPES.TEXTAREA),
    initialState: recordType => ({
      actions: [
        {
          name: '',
          value: '',
          parameters: getActionParameters(OPTIONS.INSTANCE_NOTE, recordType),
        },
      ]
    }),
  },
  [OPTIONS.HOLDINGS_NOTE]: {
    actions: noteActionsWithMarc(),
    controlType: action => (action === ACTIONS.CHANGE_TYPE
      ? CONTROL_TYPES.NOTE_SELECT
      : CONTROL_TYPES.TEXTAREA),
    initialState: recordType => ({
      actions: [
        {
          name: '',
          value: '',
          parameters: getActionParameters(OPTIONS.HOLDINGS_NOTE, recordType),
        },
      ]
    }),
  },
  [OPTIONS.ITEM_NOTE]: {
    actions: noteActionsWithMarc(),
    controlType: action => (action === ACTIONS.CHANGE_TYPE
      ? CONTROL_TYPES.NOTE_SELECT
      : CONTROL_TYPES.TEXTAREA),
    initialState: recordType => ({
      actions: [
        {
          name: '',
          value: '',
          parameters: getActionParameters(OPTIONS.ITEM_NOTE, recordType),
        },
      ]
    }),
  },

  [OPTIONS.ELECTRONIC_ACCESS_URL_RELATIONSHIP]: {
    actions: electronicAccessWithFindFullField(),
    controlType: CONTROL_TYPES.ELECTRONIC_ACCESS_RELATIONSHIP_SELECT,
    initialState: secondOnly,
  },

  [OPTIONS.ELECTRONIC_ACCESS_LINK_TEXT]: {
    actions: electronicAccess(),
    controlType: CONTROL_TYPES.TEXTAREA,
    initialState: secondOnly,
  },
  [OPTIONS.ELECTRONIC_ACCESS_MATERIALS_SPECIFIED]: {
    actions: electronicAccess(),
    controlType: CONTROL_TYPES.TEXTAREA,
    initialState: secondOnly,
  },
  [OPTIONS.ELECTRONIC_ACCESS_URI]: {
    actions: electronicAccess(),
    controlType: CONTROL_TYPES.TEXTAREA,
    initialState: secondOnly,
  },
  [OPTIONS.ELECTRONIC_ACCESS_URL_PUBLIC_NOTE]: {
    actions: electronicAccess(),
    controlType: CONTROL_TYPES.TEXTAREA,
    initialState: secondOnly,
  },
};

const nextActionConfig = {
  [OPTIONS.ITEM_NOTE]: CONTROL_TYPES.TEXTAREA,
  [OPTIONS.ADMINISTRATIVE_NOTE]: CONTROL_TYPES.TEXTAREA,
  [OPTIONS.ELECTRONIC_ACCESS_URI]: CONTROL_TYPES.TEXTAREA,
  [OPTIONS.ELECTRONIC_ACCESS_LINK_TEXT]: CONTROL_TYPES.TEXTAREA,
  [OPTIONS.ELECTRONIC_ACCESS_MATERIALS_SPECIFIED]:CONTROL_TYPES.TEXTAREA,
  [OPTIONS.CHECK_IN_NOTE]: CONTROL_TYPES.TEXTAREA,
  [OPTIONS.CHECK_OUT_NOTE]: CONTROL_TYPES.TEXTAREA,
  [OPTIONS.HOLDINGS_NOTE]: CONTROL_TYPES.TEXTAREA,
  [OPTIONS.INSTANCE_NOTE]: CONTROL_TYPES.TEXTAREA,
  [OPTIONS.ELECTRONIC_ACCESS_URL_PUBLIC_NOTE]: CONTROL_TYPES.TEXTAREA,
  [OPTIONS.ELECTRONIC_ACCESS_URL_RELATIONSHIP]: CONTROL_TYPES.ELECTRONIC_ACCESS_RELATIONSHIP_SELECT,
};

export const getDefaultActionLists = (option, recordType) => {
  const cfg = firstActionConfig[option];
  if (!cfg) return [];
  return typeof cfg.actions === 'function'
    ? cfg.actions(recordType)
    : cfg.actions;
};

export const getControlType = (option, action) => {
  const cfg = firstActionConfig[option];
  if (!cfg) return null;
  return typeof cfg.controlType === 'function'
    ? cfg.controlType(action)
    : cfg.controlType;
};

export const getDefaultActionState = (option, recordType) => {
  const cfg = firstActionConfig[option];
  if (!cfg) return [];
  return typeof cfg.initialState === 'function'
    ? cfg.initialState(recordType)
    : cfg.initialState;
};

export const getNextActionLists = (option, action) => {
  if (action !== ACTIONS.FIND) {
    return [];
  }

  if (!nextActionConfig[option]) {
    return [];
  }

  return commonAdditionalActions();
};

export const getNextControlType = (option, action) => {
  if (action !== ACTIONS.FIND) {
    return null;
  }
  return nextActionConfig[option] || null;
};

export const getNextActionState = (option, action) => {
  if (action !== ACTIONS.FIND) return [];
  if (!nextActionConfig[option]) return [];
  return [{
    name: '',
    value: '',
  }];
};
