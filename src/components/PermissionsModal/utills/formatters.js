import { Checkbox } from '@folio/stripes/components';
import { getPermissionLabelString } from '@folio/stripes/util';
import { FormattedMessage } from 'react-intl';
import React from 'react';
import { FILTER_KEYS } from '../constants/core';

export const permsFormatter = ({ selectedPermissions, formatMessage, onRowClicked }) => ({
  selected: permission => (
    <div onClick={e => e.stopPropagation()}>
      <Checkbox
        id={permission.id}
        checked={selectedPermissions.includes(permission.id)}
        onChange={() => onRowClicked(permission.id)}
      />
    </div>
  ),
  // eslint-disable-next-line react/prop-types
  permissionName: permission => getPermissionLabelString(permission, formatMessage),
  status: permission => {
    const statusKey = selectedPermissions.includes(permission.id)
      ? FILTER_KEYS.ASSIGNED
      : FILTER_KEYS.UNASSIGNED;

    return <FormattedMessage id={`ui-bulk-edit.permissionsModal.list.cell.${statusKey}`} />;
  },
  // eslint-disable-next-line react/prop-types
  type: ({ type }) => <FormattedMessage id={`ui-bulk-edit.permissionsModal.list.cell.${type}`} />,
});
