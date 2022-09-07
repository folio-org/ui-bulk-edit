import { FormattedMessage } from 'react-intl';
import React from 'react';

export const SUPPORTED_FILE_EXTENSIONS = ['csv'];

export const BULK_EDIT_IDENTIFIERS = 'BULK_EDIT_IDENTIFIERS';
export const BULK_EDIT_QUERY = 'BULK_EDIT_QUERY';

export const BULK_EDIT_BARCODE = 'BARCODE';

export const BULK_EDIT_UPDATE = 'BULK_EDIT_UPDATE';

export const USER_COLUMNS = [
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.active" />,
    value: 'active',
    disabled: false,
    selected: true,
  },
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.lastName" />,
    value: 'lastName',
    disabled: false,
    selected: true,
  },
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.firstName" />,
    value: 'firstName',
    disabled: false,
    selected: true,
  },
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.barcode" />,
    value: 'barcode',
    disabled: false,
    selected: true,
  },
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.patronGroup" />,
    value: 'patronGroup',
    disabled: false,
    selected: true,
  },
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.username" />,
    value: 'username',
    disabled: false,
    selected: true,
  },
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.email" />,
    value: 'email',
    disabled: false,
    selected: false,
  },
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.expirationDate" />,
    value: 'expirationDate',
    disabled: false,
    selected: false,
  },
];

export const INVENTORY_COLUMNS_BASE = [
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.barcode" />,
    value: 'barcode',
    disabled: false,
    selected: true,
  },
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.status" />,
    value: 'status',
    disabled: false,
    selected: true,
  },
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.effectiveLocation" />,
    value: 'effectiveLocation',
    disabled: false,
    selected: true,
  },
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.callNumber" />,
    value: 'callNumber',
    disabled: false,
    selected: true,
  },
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.hrid" />,
    value: 'hrid',
    disabled: false,
    selected: true,
  },
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.materialType" />,
    value: 'materialType',
    disabled: false,
    selected: true,
  },
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.permanentLoanType" />,
    value: 'permanentLoanType',
    disabled: false,
    selected: true,
  },
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.temporaryLoanType" />,
    value: 'temporaryLoanType',
    disabled: false,
    selected: true,
  },
];

export const INVENTORY_COLUMNS = [
  ...INVENTORY_COLUMNS_BASE,
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.id" />,
    value: 'id',
    disabled: false,
    selected: false,
  },
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.formerIds" />,
    value: 'formerIds',
    disabled: false,
    selected: false,
  },
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.accessionNumber" />,
    value: 'accessionNumber',
    disabled: false,
    selected: false,
  },
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.permanentLocation" />,
    value: 'permanentLocation',
    disabled: false,
    selected: false,
  },
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.temporaryLocation" />,
    value: 'temporaryLocation',
    disabled: false,
    selected: false,
  },
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.copyNumber" />,
    value: 'copyNumber',
    disabled: false,
    selected: false,
  },
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.enumeration" />,
    value: 'enumeration',
    disabled: false,
    selected: false,
  },
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.chronology" />,
    value: 'chronology',
    disabled: false,
    selected: false,
  },
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.volume" />,
    value: 'volume',
    disabled: false,
    selected: false,
  },
];

export const CRITERIES = {
  IDENTIFIER: 'identifier',
  QUERY: 'query',
};

export const CAPABILITIES = {
  ITEM: 'ITEMS',
  USER: 'USERS',
  HOLDINGS: 'HOLDINGS_RECORD',
};

export const CAPABILITIES_VALUE = {
  ITEMS: 'item',
  USERS: 'user',
};

export const ACTIONS = {
  REPLACE: 'REPLACE_WITH',
  CLEAR: 'CLEAR_FIELD',
  FIND: 'FIND',
};

export const OPTIONS = {
  TEMPORARY_LOCATION: 'TEMPORARY_LOCATION',
  PERMANENT_LOCATION: 'PERMANENT_LOCATION',
  STATUS: 'STATUS',
  EXPIRATION_DATE: 'EXPIRATION_DATE',
  EMAIL_ADDRESS: 'EMAIL_ADDRESS',
  PATRON_GROUP: 'PATRON_GROUP',
  TEMPORARY_LOAN_TYPE: 'TEMPORARY_LOAN_TYPE',
  PERMANENT_LOAN_TYPE: 'PERMANENT_LOAN_TYPE',
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
  value: ACTIONS.REPLACE,
  label: formatMessage({ id: 'ui-bulk-edit.layer.action.replace' }),
  disabled: false,
});

export const getClearAction = (formatMessage) => ({
  value: ACTIONS.CLEAR,
  label: formatMessage({ id: 'ui-bulk-edit.layer.action.clear' }),
  disabled: false,
});

export const PATRON_ACTIONS = (formatMessage) => [
  getReplaceAction(formatMessage),
];

export const EXPIRATION_ACTIONS = (formatMessage) => [
  getReplaceAction(formatMessage),
];

export const EMAIL_ACTIONS_FIRST = (formatMessage) => [
  getFindAction(formatMessage),
];

export const EMAIL_ACTIONS_SECOND = (formatMessage) => [
  getReplaceAction(formatMessage),
];

export const BASE_ACTIONS = (formatMessage) => [
  getPlaceholder(formatMessage),
  getReplaceAction(formatMessage),
  getClearAction(formatMessage),
];

export const USER_OPTIONS = (formatMessage) => [
  {
    value: OPTIONS.EMAIL_ADDRESS,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.email' }),
    disabled: false,
  },
  {
    value: OPTIONS.EXPIRATION_DATE,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.expirationDate' }),
    disabled: false,
  },
  {
    value: OPTIONS.PATRON_GROUP,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.patronGroup' }),
    disabled: false,
  },
];

export const ITEMS_OPTIONS = (formatMessage) => [
  {
    value: OPTIONS.TEMPORARY_LOCATION,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.temporaryLocation' }),
    disabled: false,
  },
  {
    value: OPTIONS.PERMANENT_LOCATION,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.permanentLocation' }),
    disabled: false,
  },
  {
    value: OPTIONS.STATUS,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.statusLabel' }),
    disabled: false,
  },
  {
    value: OPTIONS.TEMPORARY_LOAN_TYPE,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.temporaryLoanTypeLabel' }),
    disabled: false,
  },
  {
    value: OPTIONS.PERMANENT_LOAN_TYPE,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.permanentLoanType' }),
    disabled: false,
  },
];

export const ITEM_STATUS_OPTIONS = (formatMessage) => [
  {
    value: '',
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.placeholder' }),
    disabled: true,
  },
  {
    value: 'Available',
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.available' }),
    disabled: false,
  },
  {
    value: 'Withdrawn',
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.withdrawn' }),
    disabled: false,
  },
  {
    value: 'Missing',
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.missing' }),
    disabled: false,
  },
  {
    value: 'In process (non-requestable)',
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.non-requestable' }),
    disabled: false,
  },
  {
    value: 'Intellectual item"',
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.intellectual' }),
    disabled: false,
  },
  {
    value: 'Long missing',
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.longMissing' }),
    disabled: false,
  },
  {
    value: 'Restricted',
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.restricted' }),
    disabled: false,
  },
  {
    value: 'Unavailable',
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.unavailable' }),
    disabled: false,
  },
  {
    value: 'Unknown',
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.unknown' }),
    disabled: false,
  },
];

export const TYPE_OF_PROGRESS = {
  INITIAL: 'initial',
  PROCESSED: 'processed',
};

export const JOB_STATUSES = {
  SUCCESSFUL: 'SUCCESSFUL',
  FAILED: 'FAILED',
};

export const itemColumnInAppWidths = {
  barcode: '110px',
  status: '110px',
  effectiveLocation: '160px',
  materialType: '100px',
  permanentLoanType: '120px',
  temporaryLoanType: '120px',
};

export const controlTypes = {
  SELECT: 'SELECT',
  DATE: 'DATE',
  INPUT: 'INPUT',
};

export const translationSuffix = {
  [CAPABILITIES.USER]: '',
  [CAPABILITIES.ITEM]: '.item',
  [CAPABILITIES.HOLDINGS]: '.holdings',
};
