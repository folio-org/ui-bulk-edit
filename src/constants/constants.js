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
};

export const CAPABILITIES_PARAMS = {
  ITEM: 'ITEM',
  USER: 'USER',
};

export const CAPABILITIES_VALUE = {
  ITEM: 'item',
  USER: 'user',
};

export const ITEMS_ACTION = (formatMessage) => [
  {
    value: '',
    label: formatMessage({ id: 'ui-bulk-edit.actions.placeholder' }),
    disabled: true,
  },
  {
    value: 'REPLACE_WITH',
    label: formatMessage({ id: 'ui-bulk-edit.layer.action.replace' }),
    disabled: false,
  },
  {
    value: 'CLEAR_FIELD',
    label: formatMessage({ id: 'ui-bulk-edit.layer.action.clear' }),
    disabled: false,
  },
];

export const USER_OPTIONS = (formatMessage) => [
  {
    value: 'EXPIRATION_DATE',
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.expirationDate' }),
    disabled: false,
  },
];

export const ACTIONS = {
  REPLACE: 'REPLACE_WITH',
  CLEAR: 'CLEAR_FIELD',
};

export const OPTIONS = {
  TEMPORARY_LOCATION: 'TEMPORARY_LOCATION',
  PERMANENT_LOCATION: 'PERMANENT_LOCATION',
  STATUS: 'STATUS',
  EXPIRATION_DATE: 'EXPIRATION_DATE',
};

export const ITEMS_OPTIONS = (formatMessage) => [
  {
    value: 'TEMPORARY_LOCATION',
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.temporary' }),
    disabled: false,
  },
  {
    value: 'PERMANENT_LOCATION',
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.permanent' }),
    disabled: false,
  },
  {
    value: 'STATUS',
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.statusLabel' }),
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
