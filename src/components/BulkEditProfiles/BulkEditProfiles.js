import PropTypes from 'prop-types';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import {
  useLocation,
  useRouteMatch,
} from 'react-router-dom';

import {
  Icon,
  MultiColumnList,
  TextLink,
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
  COLUMN_MAPPING,
  COLUMNS,
  NON_INTERACTIVE_HEADERS,
  VISIBLE_COLUMNS,
} from './constants';

const isEmptyMessage = <FormattedMessage id="ui-bulk-edit.settings.profiles.empty" />;

const getResultsFormatter = (entityType, searchTerm, path, search) => {
  return {
    [COLUMNS.name]: (profile) => (
      <AppIcon
        app="bulk-edit"
        iconKey={RECORD_TYPES_MAPPING[entityType]}
        size="small"
      >
        <TextLink to={`${path}/${profile.id}${search}`}>
          <DefaultColumn
            searchTerm={searchTerm}
            value={profile.name}
          />
        </TextLink>
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
}) => {
  const { search } = useLocation();
  const { path } = useRouteMatch();

  const formatter = useMemo(
    () => getResultsFormatter(entityType, searchTerm, path, search),
    [entityType, path, searchTerm, search],
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
      nonInteractiveHeaders={NON_INTERACTIVE_HEADERS}
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
};
