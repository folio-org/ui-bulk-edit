import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  useTransition,
} from 'react';
import { debounce, noop } from 'lodash';
import PropTypes from 'prop-types';
import queryString from 'query-string';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import {
  Route,
  useHistory,
  useLocation,
} from 'react-router-dom';
import { useRouteMatch } from 'react-router';

import {
  Button,
  Layer,
  Pane,
  PaneHeader,
  SearchField,
} from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';
import { getFullName } from '@folio/stripes/util';
import {
  buildSearch,
  filterAndSort,
  SEARCH_PARAMETER,
  SORTING_DIRECTION_PARAMETER,
  SORTING_PARAMETER,
  useLocationSorting,
  useUsersBatch,
} from '@folio/stripes-acq-components';

import {
  CAPABILITIES,
  RECORD_TYPES_MAPPING,
} from '../../constants';
import { useBulkEditProfiles } from '../../hooks/api';
import { BulkEditProfileDetails } from './BulkEditProfileDetails';
import { BulkEditProfiles } from './BulkEditProfiles';
import {
  DEFAULT_SORTING,
  FILTER_SORT_CONFIG,
  SORTABLE_COLUMNS,
} from './constants';
import { useBulkPermissions } from '../../hooks';

import css from './BulkEditProfilesPane.css';
import { BulkEditCreateProfile } from './forms/BulkEditCreateProfile';

export const BulkEditProfilesPane = ({
  entityType,
  title,
}) => {
  const [isPending, startTransition] = useTransition();
  const intl = useIntl();
  const location = useLocation();
  const history = useHistory();
  const { path } = useRouteMatch();
  const { hasSettingsCreatePerms } = useBulkPermissions();

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
    isFetching,
    isLoading: isProfilesLoading,
    profiles,
    refetch,
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

  const openCreateProfile = useCallback(() => {
    history.push({
      pathname: `${path}/create`,
      search: location.search,
    });
  }, [history, location.search, path]);

  const closeFormLayer = useCallback(() => {
    history.push({
      pathname: path,
      search: location.search,
    });
  }, [history, location.search, path]);

  const renderHeader = useCallback((renderProps) => {
    const paneSub = !isProfilesLoading && (
      <FormattedMessage
        id="ui-bulk-edit.settings.profiles.paneSub"
        values={{ count: filteredProfiles?.length }}
      />
    );

    const newButton = hasSettingsCreatePerms && (
      <Button
        buttonStyle="primary"
        id="create-new-profile"
        marginBottom0
        onClick={openCreateProfile}
      >
        <FormattedMessage id="ui-bulk-edit.settings.profiles.button.new" />
      </Button>
    );

    const paneTitle = (
      <AppIcon
        app="bulk-edit"
        iconKey={RECORD_TYPES_MAPPING[entityType]}
        size="small"
      >
        {title}
      </AppIcon>
    );

    return (
      <PaneHeader
        {...renderProps}
        paneTitle={paneTitle}
        lastMenu={newButton}
        paneSub={paneSub}
      />
    );
  }, [entityType, filteredProfiles, isProfilesLoading, openCreateProfile, title, hasSettingsCreatePerms]);

  const isLoading = isFetching || isUsersLoading || isPending;

  const onCloseDetailsPane = useCallback(() => {
    history.push({
      pathname: path,
      search: location.search,
    });
  }, [history, location.search, path]);

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

      <Route
        exact
        path={`${path}/:id/view`}
        render={(props) => (
          <Layer isOpen>
            <BulkEditProfileDetails
              {...props}
              entityType={entityType}
              onClose={onCloseDetailsPane}
              refetch={refetch}
            />
          </Layer>
        )}
      />

      <Route
        exact
        path={`${path}/create`}
        render={() => (
          <Layer isOpen>
            <BulkEditCreateProfile
              entityType={entityType}
              onClose={closeFormLayer}
            />
          </Layer>
        )}
      />
    </Pane>
  );
};

BulkEditProfilesPane.propTypes = {
  entityType: PropTypes.oneOf(Object.values(CAPABILITIES)).isRequired,
  title: PropTypes.node.isRequired,
};
