import { FormattedMessage } from 'react-intl';

export const ACTIONS = {
  // actions
  ADD_TO_EXISTING: 'ADD_TO_EXISTING',
  CLEAR_FIELD: 'CLEAR_FIELD',
  REPLACE_WITH: 'REPLACE_WITH',
  FIND_REPLACE_WITH: 'FIND_AND_REPLACE',
  FIND_REMOVE_THESE: 'FIND_AND_REMOVE_THESE',
  SET_TO_TRUE: 'SET_TO_TRUE',
  SET_TO_FALSE: 'SET_TO_FALSE',
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
  ACTIONS.MARK_AS_STAFF_ONLY,
  ACTIONS.REMOVE_MARK_AS_STAFF_ONLY,
  ACTIONS.REMOVE_ALL,
  ACTIONS.REMOVE_THESE,
];

export const REQUIRES_INITIAL_ACTIONS = [
  ACTIONS.FIND_REMOVE_THESE,
];

export const getPlaceholder = () => ({
  value: '',
  label:  <FormattedMessage id="ui-bulk-edit.actions.placeholder" />,
  disabled: true,
});

export const getFindFullFieldAction = () => ({
  value: ACTIONS.FIND,
  label:  <FormattedMessage id="ui-bulk-edit.actions.findFullField" />,
  disabled: false,
});

export const getFindAction = () => ({
  value: ACTIONS.FIND,
  label: <FormattedMessage id="ui-bulk-edit.actions.find" />,
  disabled: false,
});

export const getReplaceAction = () => ({
  value: ACTIONS.REPLACE_WITH,
  label: <FormattedMessage id="ui-bulk-edit.layer.action.replace" />,
  disabled: false,
});

export const getClearAction = () => ({
  value: ACTIONS.CLEAR_FIELD,
  label: <FormattedMessage id="ui-bulk-edit.layer.action.clear" />,
  disabled: false,
});

export const getSetToTrueAction = () => ({
  value: ACTIONS.SET_TO_TRUE,
  label: <FormattedMessage id="ui-bulk-edit.layer.options.items.true" />,
  disabled: false,
});

export const getSetToFalseAction = () => ({
  value: ACTIONS.SET_TO_FALSE,
  label: <FormattedMessage id="ui-bulk-edit.layer.options.items.false" />,
  disabled: false,
});

export const getChangeNoteTypeAction = () => ({
  value: ACTIONS.CHANGE_TYPE,
  label: <FormattedMessage id="ui-bulk-edit.layer.options.items.changeNote" />,
  disabled: false,
});

export const getMarcAsStuffOnlyAction = () => ({
  value: ACTIONS.MARK_AS_STAFF_ONLY,
  label: <FormattedMessage id="ui-bulk-edit.layer.options.items.markAsStaffOnly" />,
  disabled: false,
});

export const getRemoveMarcAsStuffOnlyAction = () => ({
  value: ACTIONS.REMOVE_MARK_AS_STAFF_ONLY,
  label: <FormattedMessage id="ui-bulk-edit.layer.options.items.removeMarkAsStaffOnly" />,
  disabled: false,
});

export const getRemoveAllAction = () => ({
  value: ACTIONS.REMOVE_ALL,
  label: <FormattedMessage id="ui-bulk-edit.layer.options.items.removeAll" />,
  disabled: false,
});

export const getAddToExistingAction = () => ({
  value: ACTIONS.ADD_TO_EXISTING,
  label: <FormattedMessage id="ui-bulk-edit.layer.options.items.addNote" />,
  disabled: false,
});

export const getAddAction = () => ({
  value: ACTIONS.ADD_TO_EXISTING,
  label: <FormattedMessage id="ui-bulk-edit.layer.options.add" />,
  disabled: false,
});

export const getRemoveTheseAction = () => ({
  value: ACTIONS.REMOVE_THESE,
  label: <FormattedMessage id="ui-bulk-edit.layer.options.items.removeNote" />,
  disabled: false,
});

export const getDuplicateToNoteAction = () => ({
  value: ACTIONS.DUPLICATE,
  label: <FormattedMessage id="ui-bulk-edit.layer.options.items.duplicateTo" />,
  disabled: false,
});

export const emailActionsFind = () => [getFindAction()];
export const emailActionsReplace = () => [getReplaceAction()];
export const patronActions = () => [getReplaceAction()];
export const expirationActions = () => [getReplaceAction()];
export const statusActions = () => [getReplaceAction()];
export const permanentLoanTypeActions = () => [getReplaceAction()];
export const permanentHoldingsLocation = () => [getReplaceAction()];
export const replaceClearActions = () => [
  getPlaceholder(),
  getReplaceAction(),
  getClearAction(),
];
export const suppressFromDiscActions = () => [
  getPlaceholder(),
  getSetToTrueAction(),
  getSetToFalseAction(),
];
export const noteActions = () => [
  getPlaceholder(),
  getAddToExistingAction(),
  getRemoveAllAction(),
  getFindFullFieldAction(),
  getChangeNoteTypeAction(),
];

export const noteActionsWithMarc = () => [
  getPlaceholder(),
  getMarcAsStuffOnlyAction(),
  getRemoveMarcAsStuffOnlyAction(),
  getAddToExistingAction(),
  getRemoveAllAction(),
  getFindFullFieldAction(),
  getChangeNoteTypeAction(),
];

export const electronicAccess = () => [
  getPlaceholder(),
  getClearAction(),
  getFindFullFieldAction(),
  getReplaceAction(),
];
export const noteActionsWithDuplicate = () => [
  getPlaceholder(),
  getMarcAsStuffOnlyAction(),
  getRemoveMarcAsStuffOnlyAction(),
  getAddToExistingAction(),
  getRemoveAllAction(),
  getFindFullFieldAction(),
  getChangeNoteTypeAction(),
  getDuplicateToNoteAction(),
];
export const commonAdditionalActions = () => [
  getPlaceholder(),
  getReplaceAction(),
  getRemoveTheseAction(),
];
