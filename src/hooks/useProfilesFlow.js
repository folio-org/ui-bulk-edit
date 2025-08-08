import { useCallback, useEffect, useMemo, useState, useTransition } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import queryString from 'query-string';
import {
  buildSearch,
  filterAndSort,
  SEARCH_PARAMETER,
  SORTING_DIRECTION_PARAMETER,
  SORTING_PARAMETER,
  useLocationSorting,
  useUsersBatch
} from '@folio/stripes-acq-components';
import { debounce, noop } from 'lodash';
import { getFullName } from '@folio/stripes/util';
import { DEFAULT_SORTING, FILTER_SORT_CONFIG, SORTABLE_COLUMNS } from '../components/BulkEditProfiles/constants';
import { useBulkEditProfiles } from './api';

export const useProfilesFlow = (entityType) => {
  const [isPending, startTransition] = useTransition();
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
    SORTABLE_COLUMNS,
    DEFAULT_SORTING,
  );

  const {
    isFetching: isProfilesFetching,
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

  const changeSearch = useCallback((e) => {
    const value = e?.target?.value;

    setSearchTerm(value);
    debouncedHistoryPush({
      pathname: location.pathname,
      search: buildSearch({ [SEARCH_PARAMETER]: value }, location.search),
    });
  }, [debouncedHistoryPush, location.pathname, location.search]);

  const clearProfilesState = useCallback(() => {
    setSearchTerm('');
    debouncedHistoryPush({
      pathname: location.pathname,
      search: buildSearch({
        [SEARCH_PARAMETER]: '',
        [SORTING_PARAMETER]: '',
        [SORTING_DIRECTION_PARAMETER]: '',
      }, location.search),
    });
  }, [debouncedHistoryPush, location.pathname, location.search]);

  return {
    filteredProfiles,
    sortOrder,
    sortDirection,
    isProfilesLoading,
    isProfilesFetching,
    isUsersLoading,
    isPending,
    searchTerm,
    changeSearch,
    clearProfilesState,
    changeLSorting,
  };
};
