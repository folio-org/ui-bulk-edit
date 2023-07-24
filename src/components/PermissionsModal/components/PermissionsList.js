import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { MultiColumnList } from '@folio/stripes/components';
import { useIntl } from 'react-intl';
import { orderBy } from 'lodash';
import { getPermissionLabelString } from '@folio/stripes/util';
import { SORT_DIRECTIONS } from '../constants/core';
import { permsFormatter } from '../utills/formatters';
import { permsColumnMapping } from '../utills/mappings';
import { permsColumnWidths, permsVisibleColumns } from '../constants/lists';

export const PermissionsList = memo(({
  selectedPermissions,
  filteredPermissions,
  onRowClicked,
  onSelectAllClicked,
}) => {
  const { formatMessage } = useIntl();
  const [sortedColumn, setSortedColumn] = useState('permissionName');
  const [sortOrder, setSortOrder] = useState(SORT_DIRECTIONS.asc.name);

  const sorters = {
    permissionName: permission => getPermissionLabelString(permission, formatMessage)?.toLowerCase(),
    status: ({ id, permissionName }) => [selectedPermissions.includes(id), permissionName],
    type: ({ mutable, permissionName }) => [!mutable, permissionName],
  };

  const sortedPermissions = orderBy(filteredPermissions, sorters[sortedColumn], sortOrder);

  const onHeaderClick = (e, { name: columnName }) => {
    if (columnName === 'selected') return;

    if (sortedColumn !== columnName) {
      setSortedColumn(columnName);
      setSortOrder(SORT_DIRECTIONS.desc.name);
    } else {
      const newSortOrder = (sortOrder === SORT_DIRECTIONS.desc.name)
        ? SORT_DIRECTIONS.asc.name
        : SORT_DIRECTIONS.desc.name;

      setSortOrder(newSortOrder);
    }
  };

  return (
    <MultiColumnList
      id="list-permissions"
      columnWidths={permsColumnWidths}
      visibleColumns={permsVisibleColumns}
      contentData={sortedPermissions}
      columnMapping={permsColumnMapping({
        selectedPermissions,
        filteredPermissions,
        onSelectAllClicked,
      })}
      formatter={permsFormatter({
        selectedPermissions,
        formatMessage,
        onRowClicked,
      })}
      onRowClick={(_, { id }) => onRowClicked(id)}
      onHeaderClick={onHeaderClick}
      sortDirection={SORT_DIRECTIONS[sortOrder].fullName}
      sortedColumn={sortedColumn}
    />
  );
});

PermissionsList.propTypes = {
  filteredPermissions: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onRowClicked: PropTypes.func.isRequired,
  onSelectAllClicked: PropTypes.func.isRequired,
};
