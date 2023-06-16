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
};

// FINAL_ACTIONS - final actions in scope of row. Not possible select anything after choosing it in row.
export const FINAL_ACTIONS = [
  ACTIONS.CLEAR_FIELD,
  ACTIONS.SET_TO_TRUE,
  ACTIONS.SET_TO_FALSE,
  ACTIONS.SET_TO_TRUE_INCLUDING_ITEMS,
  ACTIONS.SET_TO_FALSE_INCLUDING_ITEMS,
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

export const getBaseActions = (formatMessage) => [
  getPlaceholder(formatMessage),
  getReplaceAction(formatMessage),
  getClearAction(formatMessage),
];
