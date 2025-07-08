import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Icon,
  MultiColumnList,
} from '@folio/stripes/components';
import { getFullName } from '@folio/stripes/util';
import {
  DateColumn,
  DefaultColumn,
} from '@folio/stripes-data-transfer-components';

import {
  CAPABILITIES,
  RECORD_TYPES_MAPPING,
} from '../../constants';
import {
  bulkEditProfilePropTypeShape,
  userPropTypeShape,
} from '../../shapes';
import {
  COLUMN_MAPPING,
  COLUMNS,
  VISIBLE_COLUMNS,
} from './constants';

const isEmptyMessage = <FormattedMessage id="ui-bulk-edit.settings.profiles.empty" />;

const getResultsFormatter = (entityType, searchTerm, users) => {
  const usersMap = users.reduce((acc, user) => acc.set(user.id, user), new Map());

  return {
    [COLUMNS.name]: (profile) => (
      <DefaultColumn
        iconKey={RECORD_TYPES_MAPPING[entityType]}
        value={profile.name}
        searchTerm={searchTerm}
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

const COLUMN_WIDTHS = {
  [COLUMNS.name]: '30%',
};

export const BulkEditProfiles = ({
  changeSorting,
  entityType,
  isLoading,
  profiles,
  searchTerm,
  sortOrder,
  sortDirection,
  users,
}) => {
  const formatter = useMemo(
    () => getResultsFormatter(entityType, searchTerm, users),
    [entityType, searchTerm, users],
  );

  return (
    <MultiColumnList
      id={`${entityType}-profiles-list`}
      formatter={formatter}
      visibleColumns={VISIBLE_COLUMNS}
      sortOrder={sortOrder}
      sortDirection={sortDirection}
      columnWidths={COLUMN_WIDTHS}
      columnMapping={COLUMN_MAPPING}
      isEmptyMessage={isEmptyMessage}
      contentData={profiles}
      pageAmount={profiles.length}
      totalCount={profiles.length}
      loading={isLoading}
      onHeaderClick={changeSorting}
    />
  );
};

BulkEditProfiles.propTypes = {
  entityType: PropTypes.oneOf(Object.values(CAPABILITIES)),
  isLoading: PropTypes.bool,
  profiles: PropTypes.arrayOf(bulkEditProfilePropTypeShape).isRequired,
  searchTerm: PropTypes.string,
  users: PropTypes.arrayOf(userPropTypeShape).isRequired,
};
