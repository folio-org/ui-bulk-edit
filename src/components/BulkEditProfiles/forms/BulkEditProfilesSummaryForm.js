import PropTypes from 'prop-types';
import React from 'react';
import { useIntl } from 'react-intl';
import { Accordion, Checkbox, Col, Label, Layout, Row, TextArea, TextField } from '@folio/stripes/components';

export const BulkEditProfilesSummaryForm = ({ formState, lockedDisabled, onChange }) => {
  const intl = useIntl();
  const { name, description, locked } = formState;

  return (
    <Accordion
      label={intl.formatMessage({ id: 'ui-bulk-edit.settings.profiles.title.summary' })}
    >
      <Row>
        <Col xs={6}>
          <TextField
            label={intl.formatMessage({ id: 'ui-bulk-edit.settings.profiles.form.name' })}
            value={name}
            required
            onChange={(event) => onChange(event.target.value, 'name')}
          />
        </Col>
        <Col xs={6}>
          <Layout className="margin-start-gutter">
            <fieldset>
              <Label for="lockProfile">{intl.formatMessage({ id: 'ui-bulk-edit.settings.profiles.form.lockProfile' })}</Label>
              <Checkbox
                id="lockProfile"
                disabled={lockedDisabled}
                name="lockProfile"
                inline
                checked={locked}
                onChange={() => onChange(!locked, 'locked')}
              />
            </fieldset>
          </Layout>

        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          <TextArea
            label={intl.formatMessage({ id: 'ui-bulk-edit.settings.profiles.form.description' })}
            value={description}
            onChange={(event) => onChange(event.target.value, 'description')}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

BulkEditProfilesSummaryForm.propTypes = {
  formState: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    locked: PropTypes.bool.isRequired,
  }),
  lockedDisabled: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
};
