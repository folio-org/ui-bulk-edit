import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  Icon,
  MultiColumnList,
} from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';
import {
  DateColumn,
  DefaultColumn,
} from '@folio/stripes-data-transfer-components';

import {
  CAPABILITIES,
  RECORD_TYPES_MAPPING,
} from '../../constants';
import { bulkEditProfilePropTypeShape } from '../../shapes';
import {
  COLUMN_MAPPING, COLUMN_WIDTHS,
  COLUMNS,
  NON_INTERACTIVE_HEADERS,
  VISIBLE_COLUMNS,
} from './constants';

const isEmptyMessage = <FormattedMessage id="ui-bulk-edit.settings.profiles.empty" />;

const getResultsFormatter = (entityType, searchTerm) => {
  return {
    [COLUMNS.name]: (profile) => (
      <AppIcon
        app="bulk-edit"
        iconKey={RECORD_TYPES_MAPPING[entityType]}
        size="small"
      >
        <DefaultColumn
          searchTerm={searchTerm}
          value={profile.name}
        />
      </AppIcon>
    ),
    [COLUMNS.description]: (profile) => (
      <DefaultColumn
        value={profile.description}
        searchTerm={searchTerm}
      />
    ),
    [COLUMNS.updatedDate]: (profile) => <DateColumn value={profile.updatedDate} />,
    [COLUMNS.updatedBy]: (profile) => (
      <DefaultColumn
        value={profile.userFullName}
        searchTerm={searchTerm}
        iconKey="user"
      />
    ),
    [COLUMNS.status]: (profile) => {
      return (
        <>
          <FormattedMessage id="ui-bulk-edit.settings.profiles.columns.status.active" />
          {profile.locked && <Icon icon="lock" />}
        </>
      );
    },
  };
};

export const BulkEditProfiles = ({
  autosize = true,
  visibleColumns = VISIBLE_COLUMNS,
  maxHeight,
  changeSorting,
  entityType,
  isLoading,
  profiles,
  searchTerm,
  sortOrder,
  sortDirection,
  onRowClick,
}) => {
  const formatter = useMemo(
    () => getResultsFormatter(entityType, searchTerm),
    [entityType, searchTerm],
  );

  return (
    <MultiColumnList
      autosize={autosize}
      virtualize={autosize}
      id={`${entityType}-profiles-list`}
      formatter={formatter}
      visibleColumns={visibleColumns}
      sortOrder={sortOrder}
      sortDirection={sortDirection}
      columnMapping={COLUMN_MAPPING}
      columnWidths={COLUMN_WIDTHS}
      isEmptyMessage={isEmptyMessage}
      contentData={profiles}
      nonInteractiveHeaders={NON_INTERACTIVE_HEADERS}
      pageAmount={profiles.length}
      totalCount={profiles.length}
      loading={isLoading}
      onHeaderClick={changeSorting}
      onRowClick={onRowClick}
      showSortIndicator
      maxHeight={maxHeight}
    />
  );
};

BulkEditProfiles.propTypes = {
  changeSorting: PropTypes.func.isRequired,
  entityType: PropTypes.oneOf(Object.values(CAPABILITIES)),
  isLoading: PropTypes.bool,
  profiles: PropTypes.arrayOf(bulkEditProfilePropTypeShape).isRequired,
  searchTerm: PropTypes.string,
  sortOrder: PropTypes.string.isRequired,
  sortDirection: PropTypes.string.isRequired,
  autosize: PropTypes.bool,
  maxHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onRowClick: PropTypes.func.isRequired,
  visibleColumns: PropTypes.arrayOf(PropTypes.string),
};
