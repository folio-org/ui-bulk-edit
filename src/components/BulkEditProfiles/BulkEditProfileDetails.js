import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import React, {
  useCallback,
  useRef,
} from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  AccordionSet,
  AccordionStatus,
  Button,
  checkScope,
  collapseAllSections,
  ConfirmationModal,
  ExpandAllButton,
  expandAllSections,
  HasCommand,
  Headline,
  Icon,
  Layout,
  Loading,
  LoadingPane,
  MenuSection,
  Pane,
  PaneHeader,
} from '@folio/stripes/components';
import { AppIcon, TitleManager } from '@folio/stripes/core';
import {
  handleKeyCommand,
  useModalToggle,
} from '@folio/stripes-acq-components';

import { useParams } from 'react-router';
import {
  CAPABILITIES,
  RECORD_TYPES_MAPPING,
  RECORD_TYPES_PROFILES_MAPPING,
} from '../../constants';
import {
  useBulkEditProfile,
  useProfileDelete,
} from '../../hooks/api';
import { useBulkPermissions, useSearchParams } from '../../hooks';
import { ruleDetailsToSource } from '../BulkEditPane/BulkEditListResult/BulkEditInApp/helpers';
import { BulkEditProfileBulkEditsDetails } from './BulkEditProfileBulkEditsDetails';
import { BulkEditProfilesSummaryView } from './BulkEditProfilesSummaryView';
import { BulkEditProfilesMarcDetails } from './BulkEditProfileMarcDetails';

export const BulkEditProfileDetails = ({
  entityType,
  onClose,
}) => {
  const intl = useIntl();
  const { id } = useParams();
  const { currentRecordType } = useSearchParams();
  const history = useHistory();
  const accordionStatusRef = useRef();
  const {
    hasSettingsCreatePerms,
    hasSettingsDeletePerms,
    hasSettingsLockPerms,
  } = useBulkPermissions();
  const [isDeleteProfileModalOpen, toggleDeleteProfileModalModal] = useModalToggle();

  const {
    isFetching,
    isLoading,
    profile,
  } = useBulkEditProfile(id);

  const {
    deleteProfile,
    isDeletingProfile,
  } = useProfileDelete({
    onSuccess: onClose
  });

  const handleProfileDelete = useCallback(async () => {
    toggleDeleteProfileModalModal();

    await deleteProfile({ profileId: id });
  }, [deleteProfile, id, toggleDeleteProfileModalModal]);

  const renderActionMenu = useCallback(({ onToggle }) => {
    // Locked profile can't be deleted; user must have permission to delete profiles
    const isDeletionAllowed = hasSettingsDeletePerms && !profile?.locked;
    // Locked profile can be edited if user has permission to lock profiles
    const isEditAllowed = !profile?.locked || hasSettingsLockPerms;

    return hasSettingsCreatePerms && (
      <MenuSection id="bulk-edit-profile-action-menu">
        {isEditAllowed && (
          <Button
            aria-label={intl.formatMessage({ id: 'stripes-core.button.edit' })}
            buttonStyle="dropdownItem"
            onClick={() => {
              onToggle();
              history.push({
                pathname: `${id}/edit`,
                search: history.location.search,
              });
            }}
          >
            <Icon
              size="small"
              icon="edit"
            >
              <FormattedMessage id="stripes-core.button.edit" />
            </Icon>
          </Button>
        )}

        <Button
          aria-label={intl.formatMessage({ id: 'stripes-core.button.duplicate' })}
          buttonStyle="dropdownItem"
          onClick={() => {
            onToggle();
            history.push({
              pathname: `${id}/duplicate`,
              search: history.location.search,
            });
          }}
        >
          <Icon
            size="small"
            icon="duplicate"
          >
            <FormattedMessage id="stripes-core.button.duplicate" />
          </Icon>
        </Button>

        {isDeletionAllowed && (
          <Button
            aria-label={intl.formatMessage({ id: 'stripes-core.button.delete' })}
            buttonStyle="dropdownItem"
            disabled={isDeletingProfile || isFetching}
            onClick={() => {
              toggleDeleteProfileModalModal();
              onToggle();
            }}
          >
            <Icon
              size="small"
              icon="trash"
            >
              <FormattedMessage id="stripes-core.button.delete" />
            </Icon>
          </Button>
        )}
      </MenuSection>
    );
  }, [
    hasSettingsCreatePerms,
    hasSettingsDeletePerms,
    hasSettingsLockPerms,
    history,
    id,
    intl,
    isDeletingProfile,
    isFetching,
    profile?.locked,
    toggleDeleteProfileModalModal,
  ]);

  const renderHeader = useCallback((renderProps) => {
    const paneTitle = (
      <AppIcon
        app="bulk-edit"
        iconKey={RECORD_TYPES_MAPPING[entityType]}
        size="small"
      >
        {isLoading ? <Loading /> : profile?.name}
      </AppIcon>
    );

    return (
      <PaneHeader
        {...renderProps}
        actionMenu={renderActionMenu}
        paneTitle={paneTitle}
        onClose={onClose}
      />
    );
  }, [entityType, isLoading, onClose, profile?.name, renderActionMenu]);

  if (isLoading) {
    return (
      <LoadingPane
        id="loading-pane-bulk-edit-profile-details"
        renderHeader={renderHeader}
        dismissible
      />
    );
  }

  const shortcuts = [
    {
      name: 'cancel',
      shortcut: 'esc',
      handler: handleKeyCommand(onClose),
    },
    {
      name: 'expandAllSections',
      handler: (e) => expandAllSections(e, accordionStatusRef),
    },
    {
      name: 'collapseAllSections',
      handler: (e) => collapseAllSections(e, accordionStatusRef),
    },
  ];

  return (
    <HasCommand
      commands={shortcuts}
      isWithinScope={checkScope}
      scope={document.body}
    >
      <TitleManager record={profile?.name}>
        <Pane
          defaultWidth="fill"
          id="pane-bulk-edit-profile-details"
          renderHeader={renderHeader}
          actionMenu={renderActionMenu}
          dismissible
        >
          <Headline size="x-large" margin="none" tag="h1">
            {profile?.name}
          </Headline>
          <AccordionStatus ref={accordionStatusRef}>
            <Layout className="flex justify-end">
              <ExpandAllButton />
            </Layout>

            <AccordionSet>
              <BulkEditProfilesSummaryView profile={profile} />

              {currentRecordType === CAPABILITIES.INSTANCE_MARC ? (
                <BulkEditProfilesMarcDetails
                  ruleDetails={ruleDetailsToSource(profile?.ruleDetails, entityType)}
                  marcRuleDetails={profile?.marcRuleDetails}
                />
              ) : (
                <BulkEditProfileBulkEditsDetails
                  entityType={entityType}
                  isLoading={isFetching}
                  ruleDetails={ruleDetailsToSource(profile?.ruleDetails, entityType)}
                />
              )}
            </AccordionSet>
          </AccordionStatus>

          <ConfirmationModal
            confirmLabel={<FormattedMessage id="stripes-core.button.delete" />}
            heading={
              <FormattedMessage
                id="ui-bulk-edit.settings.profiles.details.action.delete.modal.heading"
                values={{ entityType: RECORD_TYPES_PROFILES_MAPPING[entityType] }}
              />
            }
            onConfirm={handleProfileDelete}
            onCancel={toggleDeleteProfileModalModal}
            open={isDeleteProfileModalOpen}
            message={(
              <FormattedMessage
                id="ui-bulk-edit.settings.profiles.details.action.delete.modal.message"
                values={{ name: profile?.name }}
              />
            )}
          />
        </Pane>
      </TitleManager>
    </HasCommand>
  );
};

BulkEditProfileDetails.propTypes = {
  entityType: PropTypes.oneOf(Object.values(CAPABILITIES)).isRequired,
  onClose: PropTypes.func.isRequired,
};
