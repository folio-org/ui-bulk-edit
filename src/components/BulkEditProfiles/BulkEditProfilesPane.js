import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
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
} from '@folio/stripes/components';
import { AppIcon, TitleManager } from '@folio/stripes/core';
import {
  CAPABILITIES,
  RECORD_TYPES_MAPPING,
} from '../../constants';
import { BulkEditProfileDetails } from './BulkEditProfileDetails';
import { useBulkPermissions } from '../../hooks';

import css from './BulkEditProfilesPane.css';
import { BulkEditCreateProfile } from './BulkEditCreateProfile';
import { BulkEditUpdateProfile } from './BulkEditUpdateProfile';
import { useProfilesFlow } from '../../hooks/useProfilesFlow';
import { BulkEditProfilesSearchAndView } from './BulkEditProfilesSearchAndView';

export const BulkEditProfilesPane = ({
  entityType,
  title,
}) => {
  const location = useLocation();
  const history = useHistory();
  const { path } = useRouteMatch();
  const { hasSettingsCreatePerms } = useBulkPermissions();
  const {
    sortOrder,
    sortDirection,
    filteredProfiles,
    isProfilesLoading,
    isProfilesFetching,
    isUsersLoading,
    isPending,
    searchTerm,
    changeSearch,
    changeLSorting,
  } = useProfilesFlow(entityType);

  const isLoading = isProfilesFetching || isUsersLoading || isPending;

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

  const closeDetailsPane = useCallback(() => {
    history.push({
      pathname: path,
      search: location.search,
    });
  }, [history, location.search, path]);

  const openProfileDetails = useCallback((e, profile) => {
    e.stopPropagation();
    history.push({
      pathname: `${path}/${profile.id}`,
      search: history.location.search,
    });
  }, [history, path]);

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

  return (
    <Pane
      defaultWidth="fill"
      renderHeader={renderHeader}
    >
      <div className={css.paneContent}>
        <BulkEditProfilesSearchAndView
          entityType={entityType}
          isLoading={isLoading}
          profiles={filteredProfiles}
          searchTerm={searchTerm}
          sortOrder={sortOrder}
          sortDirection={sortDirection}
          onRowClick={openProfileDetails}
          onSearchChange={changeSearch}
          onSortingChange={changeLSorting}
        />
      </div>

      <Route
        exact
        path={`${path}/:id`}
        render={() => (
          <Layer isOpen>
            <BulkEditProfileDetails
              entityType={entityType}
              onClose={closeDetailsPane}
            />
          </Layer>
        )}
      />

      <Route
        exact
        path={`${path}/:id/edit`}
        render={() => (
          <Layer isOpen>
            <BulkEditUpdateProfile
              entityType={entityType}
              onClose={closeFormLayer}
            />
          </Layer>
        )}
      />

      <Route
        exact
        path={`${path}/create`}
        render={() => (
          <TitleManager>
            <Layer isOpen>
              <BulkEditCreateProfile
                entityType={entityType}
                onClose={closeFormLayer}
              />
            </Layer>
          </TitleManager>
        )}
      />
    </Pane>
  );
};

BulkEditProfilesPane.propTypes = {
  entityType: PropTypes.oneOf(Object.values(CAPABILITIES)).isRequired,
  title: PropTypes.node.isRequired,
};
