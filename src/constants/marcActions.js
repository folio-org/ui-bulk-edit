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

export const getPlaceholder = () => ({
  value: '',
  label: <FormattedMessage id="ui-bulk-edit.actions.placeholder" />,
  disabled: true,
});

export const getFindEntireFieldAction = () => ({
  value: ACTIONS.FIND,
  label: <FormattedMessage id="ui-bulk-edit.actions.findEntireField" />,
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

export const getAppendAction = () => ({
  value: ACTIONS.APPEND,
  label: <FormattedMessage id="ui-bulk-edit.layer.options.append" />,
  disabled: false,
});

export const getRemoveFieldAction = () => ({
  value: ACTIONS.REMOVE_FIELD,
  label: <FormattedMessage id="ui-bulk-edit.layer.options.removeField" />,
  disabled: false,
});

export const getRemoveSubfieldAction = () => ({
  value: ACTIONS.REMOVE_SUBFIELD,
  label: <FormattedMessage id="ui-bulk-edit.layer.options.removeSubfield" />,
  disabled: false,
});

export const getReplaceWithAction = () => ({
  value: ACTIONS.REPLACE_WITH,
  label: <FormattedMessage id="ui-bulk-edit.layer.options.replaceWith" />,
  disabled: false,
});

export const marcActions = () => [
  getPlaceholder(),
  getAddAction(),
  getFindEntireFieldAction(),
  getRemoveAllAction(),
];
