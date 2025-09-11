import React, { useMemo } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Accordion, Checkbox, Col, KeyValue, Label, Row } from '@folio/stripes/components';
import { ViewMetaData } from '@folio/stripes/smart-components';

import { PROFILE_DETAILS_ACCORDIONS } from './constants';

export const BulkEditProfilesSummaryView = ({ profile }) => {
  const metadata = useMemo(() => ({
    createdDate: profile?.createdDate,
    createdByUserId: profile?.createdBy,
    updatedDate: profile?.updatedDate,
    updatedByUserId: profile?.updatedBy,
  }), [profile]);

  return (
    <Accordion
      id={PROFILE_DETAILS_ACCORDIONS.SUMMARY}
      label={<FormattedMessage id={`ui-bulk-edit.settings.profiles.details.${PROFILE_DETAILS_ACCORDIONS.SUMMARY}`} />}
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
  );
};

BulkEditProfilesSummaryView.propTypes = {
  profile: PropTypes.shape({
    name: PropTypes.string,
    description: PropTypes.string,
    locked: PropTypes.bool,
    createdDate: PropTypes.string,
    createdBy: PropTypes.string,
    updatedDate: PropTypes.string,
    updatedBy: PropTypes.string,
  }),
};
