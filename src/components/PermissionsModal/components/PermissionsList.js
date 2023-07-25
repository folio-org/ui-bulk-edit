import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { MultiColumnList } from '@folio/stripes/components';
import { useIntl } from 'react-intl';
import { orderBy } from 'lodash';
import { getPermissionLabelString } from '@folio/stripes/util';
import { SORT_DIRECTIONS } from '../constants/core';
import { permsFormatter } from '../utills/formatters';
import { permsColumnMapping } from '../utills/mappings';
import { COLUMN_WIDTHS, COLUMNS_KEYS, VISIBLE_COLUMNS } from '../constants/lists';

export const PermissionsList = ({
  selectedPermissions,
  filteredPermissions,
  onRowClicked,
  onSelectAllClicked,
}) => {
  const { formatMessage } = useIntl();
  const [sortedColumn, setSortedColumn] = useState(COLUMNS_KEYS.NAME);
  const [sortOrder, setSortOrder] = useState(SORT_DIRECTIONS.asc.name);

  const sorters = {
    permissionName: permission => getPermissionLabelString(permission, formatMessage)?.toLowerCase(),
    status: ({ id, permissionName }) => [selectedPermissions.includes(id), permissionName],
    type: ({ mutable, permissionName }) => [!mutable, permissionName],
  };

  const sortedPermissions = orderBy(filteredPermissions, sorters[sortedColumn], sortOrder);

  const handleHeaderClick = (e, { name: columnName }) => {
    if (columnName === COLUMNS_KEYS.SELECTED) return; // ignore sorting on checkbox column

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

  const handleRowClick = (_, { id }) => onRowClicked(id);

  return (
    <MultiColumnList
      id="modal-list-permissions"
      columnWidths={COLUMN_WIDTHS}
      visibleColumns={VISIBLE_COLUMNS}
      contentData={sortedPermissions}
      onRowClick={handleRowClick}
      onHeaderClick={handleHeaderClick}
      sortedColumn={sortedColumn}
      sortDirection={SORT_DIRECTIONS[sortOrder].fullName}
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
    />
  );
};

PermissionsList.propTypes = {
  filteredPermissions: PropTypes.arrayOf(PropTypes.object).isRequired,
  selectedPermissions: PropTypes.arrayOf(PropTypes.string).isRequired,
  onRowClicked: PropTypes.func.isRequired,
  onSelectAllClicked: PropTypes.func.isRequired,
};
