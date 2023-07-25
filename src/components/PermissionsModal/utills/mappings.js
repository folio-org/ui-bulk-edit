import { Checkbox } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import React from 'react';

export const permsColumnMapping = ({ selectedPermissions, filteredPermissions, onSelectAllClicked }) => ({
  selected: (
    <Checkbox
      checked={selectedPermissions.length === filteredPermissions.length}
      onChange={onSelectAllClicked}
    />
  ),
  permissionName: <FormattedMessage id="ui-bulk-edit.permissionsModal.list.columns.name" />,
  type: <FormattedMessage id="ui-bulk-edit.permissionsModal.list.columns.type" />,
  status: <FormattedMessage id="ui-bulk-edit.permissionsModal.list.columns.status" />,
});
