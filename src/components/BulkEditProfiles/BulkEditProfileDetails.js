import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import React, {
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Button,
  Checkbox,
  checkScope,
  Col,
  collapseAllSections,
  ConfirmationModal,
  ExpandAllButton,
  expandAllSections,
  HasCommand,
  Headline,
  Icon,
  KeyValue,
  Label,
  Layout,
  Loading,
  LoadingPane,
  MenuSection,
  Pane,
  PaneHeader,
  Row,
} from '@folio/stripes/components';
import { AppIcon, IfPermission, TitleManager } from '@folio/stripes/core';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  handleKeyCommand,
  useModalToggle,
} from '@folio/stripes-acq-components';

import { useParams } from 'react-router';
import {
  CAPABILITIES,
  RECORD_TYPES_MAPPING,
} from '../../constants';
import {
  useBulkEditProfile,
  useProfileDelete,
} from '../../hooks/api';
import { PROFILE_DETAILS_ACCORDIONS } from './constants';

const { SUMMARY } = PROFILE_DETAILS_ACCORDIONS;

export const BulkEditProfileDetails = ({
  entityType,
  onClose,
}) => {
  const intl = useIntl();
  const { id } = useParams();
  const history = useHistory();
  const accordionStatusRef = useRef();
  const [isDeleteProfileModalOpen, toggleDeleteProfileModalModal] = useModalToggle();

  const {
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
    return (
      <MenuSection id="bulk-edit-profile-action-menu">
        <IfPermission perm="ui-bulk-edit.settings.create">
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
        </IfPermission>
        <IfPermission perm="bulk-operations.profiles.item.delete">
          <Button
            aria-label={intl.formatMessage({ id: 'stripes-core.button.delete' })}
            buttonStyle="dropdownItem"
            disabled={isDeletingProfile}
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
        </IfPermission>
      </MenuSection>
    );
  }, [intl, history, id, isDeletingProfile, toggleDeleteProfileModalModal]);

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

  const metadata = useMemo(() => (
    profile?.metadata || {
      createdDate: profile?.createdDate,
      createdByUserId: profile?.createdBy,
      updatedDate: profile?.updatedDate,
      updatedByUserId: profile?.updatedBy,
    }
  ), [profile]);

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

              <Accordion
                id={SUMMARY}
                label={<FormattedMessage id={`ui-bulk-edit.settings.profiles.details.${SUMMARY}`} />}
              >
                <Row>
                  <Col xs={12}>
                    <ViewMetaData metadata={metadata} />
                  </Col>
                </Row>
                <Row start="xs">
                  <Col
                    xs={6}
                    lg={3}
                  >
                    <KeyValue
                      label={<FormattedMessage id="ui-bulk-edit.settings.profiles.columns.name" />}
                      value={profile?.name}
                    />
                  </Col>
                  <Col
                    xs={6}
                    lg={3}
                  >
                    <fieldset>
                      <Label for="lockProfile">
                        <FormattedMessage id="ui-bulk-edit.settings.profiles.form.lockProfile" />
                      </Label>
                      <Checkbox
                        id="lockProfile"
                        name="lockProfile"
                        inline
                        checked={profile?.locked}
                        disabled
                      />
                    </fieldset>
                  </Col>
                </Row>
                <Row>
                  <Col xs={12}>
                    <KeyValue
                      label={<FormattedMessage id="ui-bulk-edit.settings.profiles.columns.description" />}
                      value={profile?.description}
                    />
                  </Col>
                </Row>
              </Accordion>
            </AccordionSet>
          </AccordionStatus>

          <ConfirmationModal
            confirmLabel={<FormattedMessage id="stripes-core.button.delete" />}
            heading={
              <FormattedMessage
                id={`ui-bulk-edit.settings.profiles.details.action.delete.modal.heading.${RECORD_TYPES_MAPPING[entityType]}`}
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
