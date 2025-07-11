import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Icon,
  MultiColumnList,
} from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';
import { getFullName } from '@folio/stripes/util';
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
  COLUMN_MAPPING,
  COLUMNS,
  VISIBLE_COLUMNS,
} from './constants';

import css from './BulkEditProfiles.css';

const isEmptyMessage = <FormattedMessage id="ui-bulk-edit.settings.profiles.empty" />;

const getResultsFormatter = (entityType, searchTerm, usersMap) => {
  return {
    [COLUMNS.name]: (profile) => (
      <DefaultColumn
        searchTerm={searchTerm}
        value={(
          <span className={css.nameCell}>
            <AppIcon
              app="bulk-edit"
              iconKey={RECORD_TYPES_MAPPING[entityType]}
              size="small"
            />
            {profile.name}
          </span>
        )}
      />
    ),
    [COLUMNS.description]: (profile) => (
      <DefaultColumn
        value={profile.description}
        searchTerm={searchTerm}
      />
    ),
    [COLUMNS.updated]: (profile) => <DateColumn value={profile.updated} />,
    [COLUMNS.updatedBy]: (profile) => (
      <DefaultColumn
        value={getFullName(usersMap.get(profile.updatedBy))}
        searchTerm={searchTerm}
        iconKey="user"
      />
    ),
    [COLUMNS.status]: (profile) => profile.locked && (
      <Icon icon="lock" />
    ),
  };
};

export const BulkEditProfiles = ({
  changeSorting,
  entityType,
  isLoading,
  profiles,
  searchTerm,
  sortOrder,
  sortDirection,
  usersMap,
}) => {
  const formatter = useMemo(
    () => getResultsFormatter(entityType, searchTerm, usersMap),
    [entityType, searchTerm, usersMap],
  );

  return (
    <MultiColumnList
      autosize
      id={`${entityType}-profiles-list`}
      formatter={formatter}
      visibleColumns={VISIBLE_COLUMNS}
      sortOrder={sortOrder}
      sortDirection={sortDirection}
      columnMapping={COLUMN_MAPPING}
      isEmptyMessage={isEmptyMessage}
      contentData={profiles}
      pageAmount={profiles.length}
      totalCount={profiles.length}
      loading={isLoading}
      onHeaderClick={changeSorting}
      showSortIndicator
      virtualize
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
  usersMap: PropTypes.instanceOf(Map).isRequired,
};
