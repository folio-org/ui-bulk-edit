import { FormattedMessage } from 'react-intl';

export const ACTIONS = {
  // actions
  FIND: 'FIND',
  ADD_TO_EXISTING: 'ADD_TO_EXISTING',
  REMOVE_ALL: 'REMOVE_ALL',
  APPEND: 'APPEND',
  ADDITIONAL_SUBFIELD: 'ADDITIONAL_SUBFIELD',
  REMOVE_FIELD: 'REMOVE_FIELD',
  REMOVE_SUBFIELD: 'REMOVE_SUBFIELD',
  REPLACE_WITH: 'REPLACE_WITH',
};

// FINAL_ACTIONS - final actions in scope of row. Not possible select anything after choosing it in row.
export const FINAL_ACTIONS = [
  ACTIONS.REMOVE_ALL,
];

export const getPlaceholder = () => ({
  value: '',
  label: <FormattedMessage id="ui-bulk-edit.actions.placeholder" />,
  disabled: true,
});

export const getFindFullFieldAction = () => ({
  value: ACTIONS.FIND,
  label: <FormattedMessage id="ui-bulk-edit.actions.findFullField" />,
  disabled: false,
});

export const getFindAction = () => ({
  value: ACTIONS.FIND,
  label: <FormattedMessage id="ui-bulk-edit.actions.find" />,
  disabled: false,
});

export const getRemoveAllAction = () => ({
  value: ACTIONS.REMOVE_ALL,
  label: <FormattedMessage id="ui-bulk-edit.layer.options.items.removeAll" />,
  disabled: false,
});

export const getAddAction = () => ({
  value: ACTIONS.ADD_TO_EXISTING,
  label: <FormattedMessage id="ui-bulk-edit.layer.options.add" />,
  disabled: false,
});

export const getAdditionalSubfieldAction = () => ({
  value: ACTIONS.ADDITIONAL_SUBFIELD,
  label: <FormattedMessage id="ui-bulk-edit.layer.options.additionalSubfield" />,
  disabled: false,
});

export const markActions = () => [
  getPlaceholder(),
  getFindAction(),
  getAddAction(),
  getRemoveAllAction(),
];

export const markSubfieldActions = () => [
  getPlaceholder(),
  getAddAction(),
];
