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
  booleanActions,
  commonAdditionalActions,
  emailActionsReplace
} from '../../../../constants';
import { getActionParameters } from '../../../../constants/actionParameters';
import { getActionIndex } from './helpers';

/**
 * Defines default action entry template, used when the first action is not from "FINAL" actions.
 */
const initialState = {
  actions: [
    { name: '', value: '' },
  ]
};

/**
 * Configuration object for defining the initial setup of first action entries per option.
 * Maps each option key to its available actions, the control type for the first action,
 * and a factory for the initial state of the actions array.
 *
 * @type {Object.<string, {
 *   actions: Array|Function,
 *   controlType: string|Function,
 *   initialState: Array|Function
 * }>}
 */
const firstActionConfig = {
  [OPTIONS.EMAIL_ADDRESS]: {
    actions: emailActionsFind(),
    controlType: CONTROL_TYPES.INPUT,
    initialState: {
      actions: [
        { name: ACTIONS.FIND, value: '' },
        { name: ACTIONS.REPLACE_WITH, value: '' },
      ]
    },
  },

  [OPTIONS.PATRON_GROUP]: {
    actions: patronActions(),
    controlType: CONTROL_TYPES.PATRON_GROUP_SELECT,
    initialState: {
      actions: [
        { name: ACTIONS.REPLACE_WITH, value: '' },
      ]
    },
  },

  [OPTIONS.EXPIRATION_DATE]: {
    actions: expirationActions(),
    controlType: CONTROL_TYPES.DATE,
    initialState: {
      actions: [
        { name: ACTIONS.REPLACE_WITH, value: '' },
      ]
    },
  },

  [OPTIONS.TEMPORARY_HOLDINGS_LOCATION]: {
    actions: replaceClearActions(),
    controlType: CONTROL_TYPES.LOCATION,
    initialState
  },
  [OPTIONS.PERMANENT_HOLDINGS_LOCATION]: {
    actions: permanentHoldingsLocation(),
    controlType: CONTROL_TYPES.LOCATION,
    initialState: {
      actions: [
        { name: ACTIONS.REPLACE_WITH, value: '' },
      ]
    }
  },

  [OPTIONS.TEMPORARY_LOCATION]: {
    actions: replaceClearActions(),
    controlType: CONTROL_TYPES.LOCATION,
    initialState,
  },
  [OPTIONS.PERMANENT_LOCATION]: {
    actions: replaceClearActions(),
    controlType: CONTROL_TYPES.LOCATION,
    initialState,
  },

  [OPTIONS.TEMPORARY_LOAN_TYPE]: {
    actions: replaceClearActions(),
    controlType: CONTROL_TYPES.LOAN_TYPE,
    initialState,
  },
  [OPTIONS.PERMANENT_LOAN_TYPE]: {
    actions: permanentLoanTypeActions(),
    controlType: CONTROL_TYPES.LOAN_TYPE,
    initialState: {
      actions: [
        { name: ACTIONS.REPLACE_WITH, value: '' },
      ]
    },
  },

  [OPTIONS.SUPPRESS_FROM_DISCOVERY]: {
    actions: booleanActions(),
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
    actions: booleanActions(),
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
    initialState,
  },
  [OPTIONS.STATUS]: {
    actions: statusActions(),
    controlType: CONTROL_TYPES.STATUS_SELECT,
    initialState: {
      actions: [
        { name: ACTIONS.REPLACE_WITH, value: '' },
      ]
    },
  },

  [OPTIONS.ADMINISTRATIVE_NOTE]: {
    actions: (_, approach) => {
      return approach === APPROACHES.MARC
        ? noteActionsMarc()
        : noteActions();
    },
    controlType: action => (action === ACTIONS.CHANGE_TYPE
      ? CONTROL_TYPES.NOTE_SELECT
      : CONTROL_TYPES.TEXTAREA),
    initialState,
  },

  [OPTIONS.SET_RECORDS_FOR_DELETE]: {
    actions: booleanActions(),
    controlType: CONTROL_TYPES.TEXTAREA,
    initialState,
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
    initialState,
  },

  [OPTIONS.ELECTRONIC_ACCESS_LINK_TEXT]: {
    actions: electronicAccess(),
    controlType: CONTROL_TYPES.TEXTAREA,
    initialState,
  },
  [OPTIONS.ELECTRONIC_ACCESS_MATERIALS_SPECIFIED]: {
    actions: electronicAccess(),
    controlType: CONTROL_TYPES.TEXTAREA,
    initialState,
  },
  [OPTIONS.ELECTRONIC_ACCESS_URI]: {
    actions: electronicAccess(),
    controlType: CONTROL_TYPES.TEXTAREA,
    initialState,
  },
  [OPTIONS.ELECTRONIC_ACCESS_URL_PUBLIC_NOTE]: {
    actions: electronicAccess(),
    controlType: CONTROL_TYPES.TEXTAREA,
    initialState,
  },
};

/**
 * Defines which CONTROL_TYPES to use for the second action entry
 * after a FIND action selected.
 * @type {Object.<string, string>}
 */
const nextActionConfig = {
  [OPTIONS.EMAIL_ADDRESS]: CONTROL_TYPES.INPUT,
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

/**
 * Returns the list of available first-action names for a given option.
 * Delegates to firstActionConfig.actions or calls it if it’s a function.
 *
 * @param {string} option - The option key being edited.
 * @param {string} recordType - The record type context (e.g. USER, INSTANCE, ITEM etc.).
 * @param {string} approach - The current approach MARC, IN_APP or MANUAL
 * @returns {Array} Array of action identifiers.
 */
export function getDefaultActionLists(option, recordType, approach = APPROACHES.IN_APP) {
  const cfg = firstActionConfig[option];

  if (!cfg) return [];

  return typeof cfg.actions === 'function'
    ? cfg.actions(recordType, approach)
    : cfg.actions;
}

/**
 * Determines if the current control should be disabled based on rules.
 *
 * @param {Array<Object>} fields - The current fields array from the form.
 * @param {string} option - The option key being edited.
 * @returns {boolean}
 */
export const isActionControlDisabled = ({ fields, option }) => {
  const setForDeleteTrueIndex = getActionIndex(fields, OPTIONS.SET_RECORDS_FOR_DELETE, ACTIONS.SET_TO_TRUE);

  if ([OPTIONS.SUPPRESS_FROM_DISCOVERY, OPTIONS.STAFF_SUPPRESS].includes(option)) {
    return setForDeleteTrueIndex !== -1;
  }

  return false;
};

/**
 * Determines which control type to render for a first-action value field,
 * based on the option and selected action name.
 *
 * @param {string} option - The option key being edited.
 * @param {string} action - The name of the selected first action.
 * @returns {string|null} CONTROL_TYPES value or null if undefined.
 */
export function getControlType(option, action) {
  const cfg = firstActionConfig[option];

  if (!cfg) return null;

  return typeof cfg.controlType === 'function'
    ? cfg.controlType(action)
    : cfg.controlType;
}

/**
 * Provides the initial state object for first-action rows,
 * either from a template.
 *
 * @param {string} option - The option key being edited.
 * @param {string} recordType - Current record type context.
 * @returns {Object|Array} Initial actions array template.
 */
export function getDefaultActionState(option, recordType) {
  const cfg = firstActionConfig[option];

  if (!cfg) return [];

  return typeof cfg.initialState === 'function'
    ? cfg.initialState(recordType)
    : cfg.initialState;
}

/**
 * Retrieves available second-action names when the first action is FIND.
 * Returns email replacement actions for email option,
 * or a common additional list otherwise.
 *
 * @param {string} option - The option key under edit.
 * @param {string} action - The first-action name selected.
 * @returns {Array} Array of next-action identifiers.
 */
export function getNextActionLists(option, action) {
  if (action !== ACTIONS.FIND || !nextActionConfig[option]) {
    return [];
  }

  if (option === OPTIONS.EMAIL_ADDRESS) {
    return emailActionsReplace();
  }

  return commonAdditionalActions();
}

/**
 * Determines the control type for rendering the second-action input
 * after a FIND operation has been chosen.
 *
 * @param {string} option - The option key under edit.
 * @param {string} action - The first-action name selected.
 * @returns {string|null} CONTROL_TYPES value or null if none.
 */
export function getNextControlType(option, action) {
  if (action !== ACTIONS.FIND) {
    return null;
  }

  return nextActionConfig[option] || null;
}

/**
 * Generates the default state template for a second-action row,
 * creating an empty action/value pair if FIND applies.
 *
 * @param {string} option - The option key under edit.
 * @param {string} action - The first-action name selected.
 * @returns {Array} Initial second-action array (or empty if N/A).
 */
export function getNextActionState(option, action) {
  if (action !== ACTIONS.FIND || !nextActionConfig[option]) return [];

  return [{ name: '', value: '' }];
}
