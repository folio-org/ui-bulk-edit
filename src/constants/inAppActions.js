export const ACTIONS = {
  ADD_TO_EXISTING: 'ADD_TO_EXISTING',
  CLEAR_FIELD: 'CLEAR_FIELD',
  FIND: 'FIND',
  FIND_AND_REMOVE_THESE: 'FIND_AND_REMOVE_THESE',
  REPLACE_WITH: 'REPLACE_WITH',
  FIND_REPLACE_WITH: 'FIND_AND_REPLACE',
};

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

export const getBaseActions = (formatMessage) => [
  getPlaceholder(formatMessage),
  getReplaceAction(formatMessage),
  getClearAction(formatMessage),
];
