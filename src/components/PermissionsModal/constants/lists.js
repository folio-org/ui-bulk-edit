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
  <FormattedMessage id="ui-bulk-edit.list.preview.electronicAccess.relationship" />,
  <FormattedMessage id="ui-bulk-edit.list.preview.electronicAccess.uri" />,
  <FormattedMessage id="ui-bulk-edit.list.preview.electronicAccess.linkText" />,
  <FormattedMessage id="ui-bulk-edit.list.preview.electronicAccess.materialsSpecified" />,
  <FormattedMessage id="ui-bulk-edit.list.preview.electronicAccess.publicNote" />,
];

export const PREVIEW_COLUMN_WIDTHS = {
  [CUSTOM_ENTITY_COLUMNS.ELECTRONIC_ACCESS]: '850px',
};
