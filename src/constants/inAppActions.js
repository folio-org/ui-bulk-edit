export const ACTIONS = {
  ADD_TO_EXISTING: 'ADD_TO_EXISTING',
  CLEAR_FIELD: 'CLEAR_FIELD',
  FIND: 'FIND',
  FIND_AND_REMOVE_THESE: 'FIND_AND_REMOVE_THESE',
  REPLACE_WITH: 'REPLACE_WITH',
  FIND_REPLACE_WITH: 'FIND_AND_REPLACE',
  SET_TO_TRUE: 'SET_TO_TRUE',
  SET_TO_FALSE: 'SET_TO_FALSE',
  SET_TO_TRUE_INCLUDING_ITEMS: 'SET_TO_TRUE_INCLUDING_ITEMS',
  SET_TO_FALSE_INCLUDING_ITEMS: 'SET_TO_FALSE_INCLUDING_ITEMS',
  MARK_AS_STAFF_ONLY: 'MARK_AS_STAFF_ONLY',
  REMOVE_MARK_AS_STAFF_ONLY: 'REMOVE_MARK_AS_STAFF_ONLY',
  REMOVE_ALL: 'REMOVE_ALL',
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

export const getAddNoteAction = (formatMessage) => ({
  value: ACTIONS.ADD_TO_EXISTING,
  label: formatMessage({ id: 'ui-bulk-edit.layer.options.items.addNote' }),
  disabled: false,
});

export const getBaseActions = (formatMessage) => [
  getPlaceholder(formatMessage),
  getReplaceAction(formatMessage),
  getClearAction(formatMessage),
];
