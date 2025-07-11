import debounce from 'lodash/debounce';
import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import {
  useHistory,
  useLocation,
} from 'react-router-dom';

import {
  Pane,
  PaneHeader,
  SearchField,
} from '@folio/stripes/components';
import {
  buildSearch,
  filterAndSort,
  SEARCH_PARAMETER,
  SORTING_DIRECTION_PARAMETER,
  SORTING_PARAMETER,
  useLocationSorting,
  useUsersBatch,
} from '@folio/stripes-acq-components';
import { getFullName } from '@folio/stripes/util';

import { CAPABILITIES } from '../../constants';
import { useBulkEditProfiles } from '../../hooks/api';
import { BulkEditProfiles } from './BulkEditProfiles';
import {
  DEFAULT_SORTING,
  FILTER_SORT_CONFIG,
  VISIBLE_COLUMNS,
} from './constants';

import css from './BulkEditProfilesPane.css';

export const BulkEditProfilesPane = ({
  entityType,
  title,
}) => {
  const [isPending, startTransition] = useTransition();

  const intl = useIntl();
  const location = useLocation();
  const history = useHistory();

  const locationSearchQuery = queryString.parse(location.search)?.[SEARCH_PARAMETER];

  const [
    searchTerm,
    setSearchTerm,
  ] = useState(locationSearchQuery);

  const debouncedHistoryPush = useMemo(() => debounce(history.push, 300), [history.push]);

  const [
    sortOrder,
    sortDirection,
    changeLSorting,
  ] = useLocationSorting(
    location,
    history,
    noop,
    VISIBLE_COLUMNS,
    DEFAULT_SORTING,
  );

  const {
    isFetching,
    isLoading: isProfilesLoading,
    profiles,
  } = useBulkEditProfiles({ entityType });

  const userIds = useMemo(() => profiles.map(profile => profile.updatedBy), [profiles]);

  const {
    isLoading: isUsersLoading,
    users,
  } = useUsersBatch(userIds);

  const usersMap = useMemo(() => new Map(users.map(user => [user.id, user])), [users]);

  const [filteredProfiles, setFilteredProfiles] = useState(profiles);

  /*
    * Filter and sort profiles based on search term, sort order, and sort direction.
    * To optimize performance, we use `startTransition` to allow React to interrupt rendering if needed.
    * Besides we use search value from the location, that updated by debounced function
    * to avoid unnecessary re-renders when the user types in the search field.
   */
  useEffect(() => {
    startTransition(() => {
      const hydratedProfiles = profiles.map(profile => ({
        ...profile,
        userFullName: getFullName(usersMap.get(profile.updatedBy)),
      }));

      setFilteredProfiles(() => {
        return filterAndSort(
          FILTER_SORT_CONFIG,
          {
            [SEARCH_PARAMETER]: locationSearchQuery,
            [SORTING_PARAMETER]: sortOrder,
            [SORTING_DIRECTION_PARAMETER]: sortDirection,
          },
          hydratedProfiles,
        );
      });
    });
  }, [profiles, locationSearchQuery, sortOrder, sortDirection, usersMap]);

  const onSearchChange = useCallback((e) => {
    const value = e?.target?.value;

    setSearchTerm(value);
    debouncedHistoryPush({
      pathname: location.pathname,
      search: buildSearch({ [SEARCH_PARAMETER]: value }, location.search),
    });
  }, [debouncedHistoryPush, location.pathname, location.search]);

  const renderHeader = useCallback((renderProps) => {
    const paneSub = !isProfilesLoading && (
      <FormattedMessage
        id="ui-bulk-edit.settings.profiles.paneSub"
        values={{ count: filteredProfiles?.length }}
      />
    );

    return (
      <PaneHeader
        {...renderProps}
        paneTitle={title}
        paneSub={paneSub}
      />
    );
  }, [filteredProfiles?.length, isProfilesLoading, title]);

  const isLoading = isFetching || isUsersLoading || isPending;

  return (
    <Pane
      defaultWidth="fill"
      renderHeader={renderHeader}
    >
      <div className={css.paneContent}>
        <SearchField
          ariaLabel={intl.formatMessage({ id: 'ui-bulk-edit.settings.profiles.search.label' })}
          clearSearchId={`input-${entityType}-search-field-clear-button`}
          id={`input-search-${entityType}-field`}
          loading={isLoading}
          marginBottom0
          onChange={onSearchChange}
          onClear={onSearchChange}
          value={searchTerm}
        />
        <div className={css.profilesList}>
          <BulkEditProfiles
            changeSorting={changeLSorting}
            entityType={entityType}
            isLoading={isLoading}
            profiles={filteredProfiles}
            searchTerm={searchTerm}
            sortOrder={sortOrder}
            sortDirection={sortDirection}
          />
        </div>
      </div>
    </Pane>
  );
};

BulkEditProfilesPane.propTypes = {
  entityType: PropTypes.oneOf(Object.values(CAPABILITIES)).isRequired,
  title: PropTypes.node.isRequired,
};
