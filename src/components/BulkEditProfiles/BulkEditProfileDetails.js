import PropTypes from 'prop-types';
import ReactRouterPropTypes from 'react-router-prop-types';
import {
  useCallback,
  useMemo,
  useRef,
} from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Accordion,
  AccordionSet,
  AccordionStatus,
  checkScope,
  Col,
  collapseAllSections,
  ExpandAllButton,
  expandAllSections,
  HasCommand,
  KeyValue,
  Loading,
  LoadingPane,
  Pane,
  PaneHeader,
  Row,
} from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';
import { ViewMetaData } from '@folio/stripes/smart-components';
import { handleKeyCommand } from '@folio/stripes-acq-components';

import {
  CAPABILITIES,
  RECORD_TYPES_MAPPING,
} from '../../constants';
import { useBulkEditProfile } from '../../hooks/api';
import { PROFILE_DETAILS_ACCORDIONS } from './constants';

const { SUMMARY } = PROFILE_DETAILS_ACCORDIONS;

export const BulkEditProfileDetails = ({
  entityType,
  match: { params: { id } },
  onClose,
}) => {
  const accordionStatusRef = useRef();

  const {
    isLoading,
    profile,
  } = useBulkEditProfile(id);

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
        paneTitle={paneTitle}
        onClose={onClose}
      />
    );
  }, [entityType, isLoading, onClose, profile?.name]);

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
      </Pane>
    </HasCommand>
  );
};

BulkEditProfileDetails.propTypes = {
  entityType: PropTypes.oneOf(Object.values(CAPABILITIES)).isRequired,
  match: ReactRouterPropTypes.match.isRequired,
  onClose: PropTypes.func.isRequired,
};
