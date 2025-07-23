import PropTypes from 'prop-types';
import {
  useCallback,
  useMemo,
  useRef,
} from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';
import ReactRouterPropTypes from 'react-router-prop-types';

import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  Button,
  checkScope,
  Col,
  collapseAllSections,
  ConfirmationModal,
  ExpandAllButton,
  expandAllSections,
  HasCommand,
  Icon,
  KeyValue,
  Loading,
  LoadingPane,
  MenuSection,
  Pane,
  PaneHeader,
  Row,
} from '@folio/stripes/components';
import {
  AppIcon,
  IfPermission,
} from '@folio/stripes/core';
import { ViewMetaData } from '@folio/stripes/smart-components';
import {
  handleKeyCommand,
  useModalToggle,
  useShowCallout,
} from '@folio/stripes-acq-components';

import {
  CAPABILITIES,
  RECORD_TYPES_MAPPING,
} from '../../constants';
import {
  useBulkEditProfile,
  useBulkEditProfileMutation,
} from '../../hooks/api';
import { PROFILE_DETAILS_ACCORDIONS } from './constants';

const { SUMMARY } = PROFILE_DETAILS_ACCORDIONS;

export const BulkEditProfileDetails = ({
  entityType,
  match: { params: { id } },
  onClose,
  refetch,
}) => {
  const intl = useIntl();
  const accordionStatusRef = useRef();
  const [isDeleteProfileModalOpen, toggleDeleteProfileModalModal] = useModalToggle();
  const showCallout = useShowCallout();

  const {
    isLoading,
    profile,
  } = useBulkEditProfile(id);

  const {
    deleteProfile,
    isLoading: isDeletingProfile,
  } = useBulkEditProfileMutation();

  const handleProfileDelete = useCallback(() => {
    toggleDeleteProfileModalModal();

    return deleteProfile({ profileId: id })
      .then(() => {
        showCallout({ messageId: 'ui-bulk-edit.settings.profiles.details.action.delete.success' });
        refetch();
        onClose();
      })
      .catch(() => {
        showCallout({
          messageId: 'ui-bulk-edit.settings.profiles.details.action.delete.error',
          type: 'error',
        });
      });
  }, [deleteProfile, id, onClose, refetch, showCallout, toggleDeleteProfileModalModal]);

  const renderActionMenu = useCallback(({ onToggle }) => {
    return (
      <MenuSection id="bulk-edit-profile-action-menu">
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
  }, [intl, isDeletingProfile, toggleDeleteProfileModalModal]);

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
      <Pane
        defaultWidth="fill"
        id="pane-bulk-edit-profile-details"
        renderHeader={renderHeader}
        dismissible
      >
        <Row>
          <Col
            xs={12}
            md={8}
            mdOffset={2}
          >
            <AccordionStatus ref={accordionStatusRef}>
              <Row end="xs">
                <Col xs={12}>
                  <ExpandAllButton />
                </Col>
              </Row>

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
          </Col>
        </Row>

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
    </HasCommand>
  );
};

BulkEditProfileDetails.propTypes = {
  entityType: PropTypes.oneOf(Object.values(CAPABILITIES)).isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  onClose: PropTypes.func.isRequired,
  refetch: PropTypes.func.isRequired,
};
