import React, { useCallback } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  Route,
  Switch,
  useHistory,
  useLocation,
} from 'react-router-dom';
import { useRouteMatch } from 'react-router';

import {
  Button,
  Icon,
  Layer,
  MenuSection,
  Pane,
  PaneHeader,
} from '@folio/stripes/components';
import { AppIcon, TitleManager, useStripes } from '@folio/stripes/core';
import { buildSearch } from '@folio/stripes-acq-components';
import {
  CAPABILITIES,
  RECORD_TYPES_MAPPING,
  RECORD_TYPES_PROFILES_MAPPING,
} from '../../constants';
import { BulkEditProfileDetails } from './BulkEditProfileDetails';
import { useBulkPermissions } from '../../hooks';

import css from './BulkEditProfilesPane.css';
import { BulkEditCreateProfile } from './BulkEditCreateProfile';
import { BulkEditDuplicateProfile } from './BulkEditDuplicateProfile';
import { BulkEditUpdateProfile } from './BulkEditUpdateProfile';
import { useProfilesFlow } from '../../hooks/useProfilesFlow';
import { BulkEditProfilesSearchAndView } from './BulkEditProfilesSearchAndView';
import { TenantsProvider } from '../../context/TenantsContext';

const ENTITY_TYPE_DICT = {
  [CAPABILITIES.INSTANCE]: [CAPABILITIES.INSTANCE, CAPABILITIES.INSTANCE_MARC],
};

export const BulkEditProfilesPane = ({
  entityType,
  title,
}) => {
  const intl = useIntl();
  const location = useLocation();
  const history = useHistory();
  const stripes = useStripes();
  const centralTenantId = stripes?.user?.user?.consortium?.centralTenantId;
  const entityTypes = ENTITY_TYPE_DICT[entityType] || [entityType];
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
  } = useProfilesFlow(entityTypes);

  const isLoading = isProfilesFetching || isUsersLoading || isPending;

  const openCreateProfile = useCallback(() => {
    history.push({
      pathname: `${path}/create`,
      search: buildSearch({ capabilities: entityType }, location.search),
    });
  }, [entityType, history, location.search, path]);

  const closeFormLayer = useCallback(() => {
    history.push({
      pathname: path,
      search: buildSearch({ capabilities: null }, location.search),
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
      search: buildSearch({ capabilities: profile.entityType }, history.location.search),
    });
  }, [history, path]);

  const renderHeader = useCallback((renderProps) => {
    const paneSub = !isProfilesLoading && (
      <FormattedMessage
        id="ui-bulk-edit.settings.profiles.paneSub"
        values={{ count: filteredProfiles?.length }}
      />
    );

    const renderNewButton = () => {
      if (!hasSettingsCreatePerms || entityType === CAPABILITIES.INSTANCE) return null;

      return (
        <Button
          buttonStyle="primary"
          id="create-new-profile"
          marginBottom0
          onClick={openCreateProfile}
        >
          <FormattedMessage id="ui-bulk-edit.settings.profiles.button.new" />
        </Button>
      );
    };

    const renderActionMenu = ({ onToggle }) => {
      if (!hasSettingsCreatePerms || entityType !== CAPABILITIES.INSTANCE) return null;

      return (
        <MenuSection id="bulk-edit-profile-action-menu">
          <Button
            aria-label={intl.formatMessage({ id: 'ui-bulk-edit.ariaLabel.createInstanceProfile' })}
            buttonStyle="dropdownItem"
            onClick={() => {
              onToggle();
              history.push({
                pathname: `${path}/create`,
                search: buildSearch({ capabilities: CAPABILITIES.INSTANCE }, location.search),
              });
            }}
          >
            <Icon
              size="small"
              icon="plus-sign"
            >
              <FormattedMessage
                id="ui-bulk-edit.settings.profiles.title.new"
                values={{ entityType: RECORD_TYPES_PROFILES_MAPPING[CAPABILITIES.INSTANCE] }}
              />
            </Icon>
          </Button>
          <Button
            aria-label={intl.formatMessage({ id: 'ui-bulk-edit.ariaLabel.createInstanceMarcProfile' })}
            buttonStyle="dropdownItem"
            onClick={() => {
              onToggle();
              history.push({
                pathname: `${path}/create`,
                search: buildSearch({ capabilities: CAPABILITIES.INSTANCE_MARC }, location.search),
              });
            }}
          >
            <Icon
              size="small"
              icon="plus-sign"
            >
              <FormattedMessage
                id="ui-bulk-edit.settings.profiles.title.new"
                values={{ entityType: RECORD_TYPES_PROFILES_MAPPING[CAPABILITIES.INSTANCE_MARC] }}
              />
            </Icon>
          </Button>
        </MenuSection>
      );
    };

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
        lastMenu={renderNewButton()}
        actionMenu={renderActionMenu}
        paneSub={paneSub}
      />
    );
  }, [
    isProfilesLoading,
    filteredProfiles?.length,
    entityType,
    title,
    hasSettingsCreatePerms,
    openCreateProfile,
    history,
    path,
    location.search,
    intl
  ]);

  return (
    <TenantsProvider tenants={[centralTenantId]} showLocal={false}>
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

        <Switch>
          <Route
            exact
            path={`${path}/create`}
            render={() => (
              <TitleManager>
                <Layer
                  isOpen
                  contentLabel={intl.formatMessage({ id: 'ui-bulk-edit.settings.profiles.title.new' }, { entityType })}
                >
                  <BulkEditCreateProfile
                    onClose={closeFormLayer}
                  />
                </Layer>
              </TitleManager>
            )}
          />
          <Route
            exact
            path={`${path}/:id/edit`}
            render={() => (
              <Layer
                isOpen
                contentLabel={intl.formatMessage({ id: 'ui-bulk-edit.settings.profiles.title.edit' }, { entityType })}
              >
                <BulkEditUpdateProfile
                  onClose={closeFormLayer}
                />
              </Layer>
            )}
          />
          <Route
            exact
            path={`${path}/:id/duplicate`}
            render={() => (
              <Layer
                isOpen
                contentLabel={intl.formatMessage({ id: 'ui-bulk-edit.settings.profiles.title.new' }, { entityType })}
              >
                <BulkEditDuplicateProfile
                  onClose={closeFormLayer}
                />
              </Layer>
            )}
          />

          <Route
            exact
            path={`${path}/:id`}
            render={() => (
              <Layer
                isOpen
                contentLabel={intl.formatMessage({ id: 'ui-bulk-edit.settings.profiles.title.details' }, { entityType })}
              >
                <BulkEditProfileDetails
                  entityType={entityType}
                  onClose={closeDetailsPane}
                />
              </Layer>
            )}
          />
        </Switch>
      </Pane>
    </TenantsProvider>
  );
};

BulkEditProfilesPane.propTypes = {
  entityType: PropTypes.oneOf(Object.values(CAPABILITIES)).isRequired,
  title: PropTypes.node.isRequired,
};
