export const ACTIONS = {
  // actions
  ADD_TO_EXISTING: 'ADD_TO_EXISTING',
  CLEAR_FIELD: 'CLEAR_FIELD',
  REPLACE_WITH: 'REPLACE_WITH',
  FIND_REPLACE_WITH: 'FIND_AND_REPLACE',
  FIND_REMOVE_THESE: 'FIND_AND_REMOVE_THESE',
  SET_TO_TRUE: 'SET_TO_TRUE',
  SET_TO_FALSE: 'SET_TO_FALSE',
  SET_TO_TRUE_INCLUDING_ITEMS: 'SET_TO_TRUE_INCLUDING_ITEMS',
  SET_TO_FALSE_INCLUDING_ITEMS: 'SET_TO_FALSE_INCLUDING_ITEMS',
  MARK_AS_STAFF_ONLY: 'MARK_AS_STAFF_ONLY',
  REMOVE_MARK_AS_STAFF_ONLY: 'REMOVE_MARK_AS_STAFF_ONLY',
  REMOVE_ALL: 'REMOVE_ALL',
  CHANGE_TYPE: 'CHANGE_TYPE',
  DUPLICATE: 'DUPLICATE',

  // helper actions using for concatenation to final action
  FIND: 'FIND',
  REMOVE_THESE: 'REMOVE_THESE',
};

// FINAL_ACTIONS - final actions in scope of row. Not possible select anything after choosing it in row.
export const FINAL_ACTIONS = [
  ACTIONS.CLEAR_FIELD,
  ACTIONS.SET_TO_TRUE,
  ACTIONS.SET_TO_FALSE,
  ACTIONS.SET_TO_TRUE_INCLUDING_ITEMS,
  ACTIONS.SET_TO_FALSE_INCLUDING_ITEMS,
  ACTIONS.MARK_AS_STAFF_ONLY,
  ACTIONS.REMOVE_MARK_AS_STAFF_ONLY,
  ACTIONS.REMOVE_ALL,
  ACTIONS.REMOVE_THESE,
];

export const REQUIRES_INITIAL_ACTIONS = [
  ACTIONS.FIND_REMOVE_THESE,
];

export const getPlaceholder = (formatMessage) => ({
  value: '',
  label: formatMessage({ id: 'ui-bulk-edit.actions.placeholder' }),
  disabled: true,
});

export const getFindAction = (formatMessage) => ({
  value: ACTIONS.FIND,
  label: formatMessage({ id: 'ui-bulk-edit.actions.find' }),
  disabled: false,
});

export const getReplaceAction = (formatMessage) => ({
  value: ACTIONS.REPLACE_WITH,
  label: formatMessage({ id: 'ui-bulk-edit.layer.action.replace' }),
  disabled: false,
});

export const getClearAction = (formatMessage) => ({
  value: ACTIONS.CLEAR_FIELD,
  label: formatMessage({ id: 'ui-bulk-edit.layer.action.clear' }),
  disabled: false,
});

export const getSetToTrueAction = (formatMessage) => ({
  value: ACTIONS.SET_TO_TRUE,
  label: formatMessage({ id: 'ui-bulk-edit.layer.options.items.true' }),
  disabled: false,
});

export const getSetToFalseAction = (formatMessage) => ({
  value: ACTIONS.SET_TO_FALSE,
  label: formatMessage({ id: 'ui-bulk-edit.layer.options.items.false' }),
  disabled: false,
});

export const getChangeNoteTypeAction = (formatMessage) => ({
  value: ACTIONS.CHANGE_TYPE,
  label: formatMessage({ id: 'ui-bulk-edit.layer.options.items.changeNote' }),
  disabled: false,
});

export const getMarkAsStuffOnlyAction = (formatMessage) => ({
  value: ACTIONS.MARK_AS_STAFF_ONLY,
  label: formatMessage({ id: 'ui-bulk-edit.layer.options.items.markAsStaffOnly' }),
  disabled: false,
});

export const getRemoveMarkAsStuffOnlyAction = (formatMessage) => ({
  value: ACTIONS.REMOVE_MARK_AS_STAFF_ONLY,
  label: formatMessage({ id: 'ui-bulk-edit.layer.options.items.removeMarkAsStaffOnly' }),
  disabled: false,
});

export const getRemoveAllAction = (formatMessage) => ({
  value: ACTIONS.REMOVE_ALL,
  label: formatMessage({ id: 'ui-bulk-edit.layer.options.items.removeAll' }),
  disabled: false,
});

export const getAddToExistingAction = (formatMessage) => ({
  value: ACTIONS.ADD_TO_EXISTING,
  label: formatMessage({ id: 'ui-bulk-edit.layer.options.items.addNote' }),
  disabled: false,
});

export const getRemoveTheseAction = (formatMessage) => ({
  value: ACTIONS.REMOVE_THESE,
  label: formatMessage({ id: 'ui-bulk-edit.layer.options.items.removeNote' }),
  disabled: false,
});

export const getDuplicateToNoteAction = (formatMessage) => ({
  value: ACTIONS.DUPLICATE,
  label: formatMessage({ id: 'ui-bulk-edit.layer.options.items.duplicateTo' }),
  disabled: false,
});

export const emailActionsFind = (formatMessage) => [getFindAction(formatMessage)];
export const emailActionsReplace = (formatMessage) => [getReplaceAction(formatMessage)];
export const patronActions = (formatMessage) => [getReplaceAction(formatMessage)];
export const expirationActions = (formatMessage) => [getReplaceAction(formatMessage)];
export const statusActions = (formatMessage) => [getReplaceAction(formatMessage)];
export const permanentLoanTypeActions = (formatMessage) => [getReplaceAction(formatMessage)];
export const permanentHoldingsLocation = (formatMessage) => [getReplaceAction(formatMessage)];
export const replaceClearActions = (formatMessage) => [
  getPlaceholder(formatMessage),
  getReplaceAction(formatMessage),
  getClearAction(formatMessage),
];
export const suppressFromDiscActions = (formatMessage) => [
  getPlaceholder(formatMessage),
  getSetToTrueAction(formatMessage),
  getSetToFalseAction(formatMessage),
];
export const noteActions = (formatMessage) => [
  getPlaceholder(formatMessage),
  getAddToExistingAction(formatMessage),
  getRemoveAllAction(formatMessage),
  getFindAction(formatMessage),
  getChangeNoteTypeAction(formatMessage),
];

export const noteActionsWithMark = (formatMessage) => [
  getPlaceholder(formatMessage),
  getMarkAsStuffOnlyAction(formatMessage),
  getRemoveMarkAsStuffOnlyAction(formatMessage),
  getAddToExistingAction(formatMessage),
  getRemoveAllAction(formatMessage),
  getFindAction(formatMessage),
  getChangeNoteTypeAction(formatMessage),
];

export const noteActionsWithDuplicate = (formatMessage) => [
  getPlaceholder(formatMessage),
  getMarkAsStuffOnlyAction(formatMessage),
  getRemoveMarkAsStuffOnlyAction(formatMessage),
  getAddToExistingAction(formatMessage),
  getRemoveAllAction(formatMessage),
  getFindAction(formatMessage),
  getChangeNoteTypeAction(formatMessage),
  getDuplicateToNoteAction(formatMessage),
];
export const commonAdditionalActions = (formatMessage) => [
  getPlaceholder(formatMessage),
  getReplaceAction(formatMessage),
  getRemoveTheseAction(formatMessage),
];

export const urlRelationshipActions = (formatMessage) => [
  getPlaceholder(formatMessage),
  getClearAction(formatMessage),
  getFindAction(formatMessage),
  getReplaceAction(formatMessage),
];
