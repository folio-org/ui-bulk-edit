import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import { Icon, MultiColumnList } from '@folio/stripes/components';
import { getFullName } from '@folio/stripes/util';
import {
  DateColumn,
  DefaultColumn,
} from '@folio/stripes-data-transfer-components';

import {
  CAPABILITIES,
  RECORD_TYPES_MAPPING,
} from '../../constants';

const isEmptyMessage = 'ui-bulk-edit.profiles.notLoaded';

const COLUMNS = {
  name: 'name',
  description: 'description',
  updated: 'updated',
  updatedBy: 'updatedBy',
  status: 'status',
};

const COLUMN_MAPPING = {
  [COLUMNS.name]: <FormattedMessage id="ui-bulk-edit.settings.profiles.columns.name" />,
  [COLUMNS.description]: <FormattedMessage id="ui-bulk-edit.settings.profiles.columns.description" />,
  [COLUMNS.updated]: <FormattedMessage id="ui-bulk-edit.settings.profiles.columns.updated" />,
  [COLUMNS.updatedBy]: <FormattedMessage id="ui-bulk-edit.settings.profiles.columns.updatedBy" />,
  [COLUMNS.status]: <FormattedMessage id="ui-bulk-edit.settings.profiles.columns.status" />,
};
const VISIBLE_COLUMNS = Object.keys(COLUMN_MAPPING);

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
        value={profile.name}
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
  entityType,
  isLoading,
  profiles,
  searchTerm,
  users,
}) => {
  console.log('profiles', profiles);

  const formatter = useMemo(() => getResultsFormatter(entityType, searchTerm, users), [entityType, searchTerm, users]);

  return (
    <MultiColumnList
      // autosize
      id={`${entityType}-profiles-list`}
      formatter={formatter}
      visibleColumns={VISIBLE_COLUMNS}
      // sortOrder={sortOrder}
      // sortDirection={sortDirection}
      columnWidths={COLUMN_WIDTHS}
      columnMapping={COLUMN_MAPPING}
      isEmptyMessage={isEmptyMessage}
      contentData={profiles}
      pageAmount={profiles.length}
      totalCount={profiles.length}
      loading={isLoading}
    // onRowClick={this.onSelectRow}
    // onHeaderClick={this.onSort}
    />
  );
};

BulkEditProfiles.propTypes = {
  entityType: PropTypes.oneOf(Object.values(CAPABILITIES)),
  isLoading: PropTypes.bool,
  profiles: PropTypes.arrayOf(PropTypes.object).isRequired,
  searchTerm: PropTypes.string,
  users: PropTypes.arrayOf(PropTypes.object).isRequired,
};
