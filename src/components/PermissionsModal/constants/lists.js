import { FormattedMessage } from 'react-intl';
import { CUSTOM_ENTITY_COLUMNS } from '../../../constants';

export const COLUMNS_KEYS = {
  SELECTED: 'selected',
  NAME: 'permissionName',
  TYPE: 'type',
  STATUS: 'status',
};

export const VISIBLE_COLUMNS = Object.values(COLUMNS_KEYS);

export const PERMISSIONS_COLUMN_WIDTHS = {
  selected: '5',
  permissionName: '55',
  type: '20',
  status: '20',
};

export const ELECTRONIC_ACCESS_HEAD_TITLES = [
  { key: 'relationship', value: <FormattedMessage id="ui-bulk-edit.list.preview.electronicAccess.relationship" /> },
  { key: 'uri', value: <FormattedMessage id="ui-bulk-edit.list.preview.electronicAccess.uri" /> },
  { key: 'linkText', value: <FormattedMessage id="ui-bulk-edit.list.preview.electronicAccess.linkText" /> },
  { key: 'materialsSpecified', value: <FormattedMessage id="ui-bulk-edit.list.preview.electronicAccess.materialsSpecified" /> },
  { key: 'publicNote', value: <FormattedMessage id="ui-bulk-edit.list.preview.electronicAccess.publicNote" /> },
];

export const PREVIEW_COLUMN_WIDTHS = {
  [CUSTOM_ENTITY_COLUMNS.ELECTRONIC_ACCESS]: '850px',
};
