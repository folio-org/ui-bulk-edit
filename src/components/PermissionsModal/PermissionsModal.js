import React, { useCallback, useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import { Pane, Modal, Paneset, PaneHeader, Loading, Layout } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import css from './PermissionsModal.css';
import { PermissionsFilter } from './components/PermissionsFilter';
import { useAllPermissions } from './hooks/useAllPermissions';
import { PermissionsList } from './components/PermissionsList';
import { PermissionsModalFooter } from './components/PermissionsModalFooter';
import { FILTER_KEYS } from './constants/core';

const filterInitialValue = {
  [FILTER_KEYS.QUERY]: '',
  [FILTER_KEYS.PERMISSIONS]: [],
  [FILTER_KEYS.STATUSES]: [],
};

export const PermissionsModal = ({
  selectedPermissionsIds = [],
  open,
  onClose,
  onSave,
}) => {
  const [filter, setFilter] = useState(filterInitialValue);
  const [selectedPermissions, setSelectedPermissions] = useState(selectedPermissionsIds);
  const { permissions, isPermissionsLoading } = useAllPermissions();

  const filteredPermissions = useMemo(() => permissions?.filter((permission) => {
    const { query, permissions, statuses } = filter;

    const isQueryMatched = query?.length
      ? permission.displayName?.toLowerCase().includes(query.toLowerCase())
      : true;
    const isPermissionTypeMatched = permissions.length
      ? permissions.includes(permission.type)
      : true;

    const status = selectedPermissions.includes(permission.id)
      ? FILTER_KEYS.ASSIGNED
      : FILTER_KEYS.UNASSIGNED;
    const isStatusesMatched = statuses.length
      ? statuses.includes(status)
      : true;

    return isQueryMatched && isPermissionTypeMatched && isStatusesMatched;
  }), [permissions, selectedPermissions, filter]);

  const handleRowClicked = useCallback((permissionId) => {
    if (selectedPermissions.includes(permissionId)) {
      setSelectedPermissions(selectedPermissions.filter((id) => id !== permissionId));
    } else {
      setSelectedPermissions([...selectedPermissions, permissionId]);
    }
  }, [selectedPermissions]);

  const handleSelectAll = () => {
    if (selectedPermissions.length === filteredPermissions.length) {
      setSelectedPermissions([]);
    } else {
      setSelectedPermissions(filteredPermissions.map((permission) => permission.id));
    }
  };

  const handleFilterChange = (key, value) => {
    setFilter({
      ...filter,
      [key]: value,
    });
  };

  const handleClearFilter = (key) => {
    if (key === FILTER_KEYS.ALL) {
      setFilter(filterInitialValue);
    } else {
      setFilter({
        ...filter,
        [key]: [],
      });
    }
  };

  const handleSave = () => {
    onSave(selectedPermissions);
  };

  const renderPermissionsList = () => (isPermissionsLoading ? (
    <Layout className="display-flex centerContent">
      <Loading size="large" />
    </Layout>
  ) : (
    <PermissionsList
      filteredPermissions={filteredPermissions}
      selectedPermissions={selectedPermissions}
      onRowClicked={handleRowClicked}
      onSelectAllClicked={handleSelectAll}
    />
  ));

  const renderFilters = () => (
    <PermissionsFilter
      onFilter={handleFilterChange}
      onClearFilter={handleClearFilter}
      filter={filter}
    />
  );

  return (
    <Modal
      open={open}
      contentClass={css.PermissionsModal}
      id="permissions-modal"
      dismissible
      label={<FormattedMessage id="ui-bulk-edit.permissionsModal.title" />}
      size="large"
      showHeader
      onClose={onClose}
      footer={(
        <PermissionsModalFooter
          onCancel={onClose}
          onSave={handleSave}
          selectedCount={selectedPermissions?.length}
        />
      )}
    >
      <Paneset isRoot>
        <Pane
          defaultWidth="25%"
          renderHeader={renderProps => (
            <PaneHeader
              {...renderProps}
              paneTitle={<FormattedMessage id="ui-bulk-edit.permissionsModal.filter.title" />}
            />
          )}
        >
          {renderFilters()}
        </Pane>
        <Pane
          defaultWidth="fill"
          renderHeader={renderProps => (
            <PaneHeader
              {...renderProps}
              paneTitle={<FormattedMessage id="ui-bulk-edit.permissionsModal.list.title" />}
              paneSub={(
                <FormattedMessage
                  id="ui-bulk-edit.permissionsModal.list.subTitle"
                  values={{ count: permissions?.length }}
                />
              )}
            />
          )}
        >
          {renderPermissionsList()}
        </Pane>
      </Paneset>
    </Modal>
  );
};

PermissionsModal.propTypes = {
  selectedPermissionsIds: PropTypes.arrayOf(PropTypes.string),
  open: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
