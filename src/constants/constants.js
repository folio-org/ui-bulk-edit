import { FormattedMessage } from 'react-intl';

export const SUPPORTED_FILE_EXTENSIONS = ['csv'];

export const BULK_EDIT_IDENTIFIERS = 'BULK_EDIT_IDENTIFIERS';
export const BULK_EDIT_QUERY = 'BULK_EDIT_QUERY';

export const BULK_EDIT_BARCODE = 'BARCODE';

export const BULK_EDIT_UPDATE = 'BULK_EDIT_UPDATE';

export const DEFAULT_COLUMNS = [
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
