import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';
import {
  ExpandAllButton,
  Accordion,
  AccordionSet,
  Button,
  Checkbox,
  Col,
  Label,
  Layout,
  Loading,
  Pane,
  PaneFooter,
  Row,
  TextArea,
  TextField
} from '@folio/stripes/components';

import { AppIcon } from '@folio/stripes/core';
import { isEqual } from 'lodash';
import { useBulkEditForm } from '../../../hooks/useBulkEditForm';
import { validationSchema } from '../../BulkEditPane/BulkEditListResult/BulkEditInApp/validation';
import {
  folioFieldTemplate,
  getContentUpdatesBody,
  getMappedContentUpdates
} from '../../BulkEditPane/BulkEditListResult/BulkEditInApp/helpers';
import { useOptionsWithTenants } from '../../../hooks/useOptionsWithTenants';
import { APPROACHES, RECORD_TYPES_MAPPING } from '../../../constants';
import { InAppFormTitle } from '../../BulkEditPane/BulkEditListResult/BulkEditInApp/InAppForm/InAppFormTitle';
import { InAppFormBody } from '../../BulkEditPane/BulkEditListResult/BulkEditInApp/InAppForm/InAppFormBody';
import { profilesValidationSchema } from './validation';
import { getFormErrors } from '../../../utils/helpers';
import { PreventFormCloseModal } from './PreventFormCloseModal';

const initialFormState = (entityType) => ({
  name: '',
  description: '',
  locked: false,
  entityType,
});

export const BulkEditProfilesForm = ({ entityType, onClose, onSave }) => {
  const intl = useIntl();
  const { options, areAllOptionsLoaded } = useOptionsWithTenants(entityType);
  const { fields, setFields, isValid: areContentUpdatesValid, isPristine: isContentUpdatePristine } = useBulkEditForm({
    validationSchema,
    template: folioFieldTemplate
  });
  const [formState, setFormState] = useState(initialFormState(entityType));
  const [preventModalOpen, setPreventModalOpen] = useState(false);

  const { name, description, locked } = formState;
  const friendlyEntityType = RECORD_TYPES_MAPPING[entityType];

  const errors = getFormErrors(formState, profilesValidationSchema);
  const isFormValid = Object.keys(errors).length === 0;
  const isSaveDisabled = !areContentUpdatesValid || !isFormValid;
  const isFormPristine = isEqual(formState, initialFormState(entityType));

  const openPreventModal = () => {
    setPreventModalOpen(true);
  };

  const closePreventModal = () => {
    setPreventModalOpen(false);
  };

  const handleTryClose = () => {
    if (isContentUpdatePristine && isFormPristine) {
      onClose();
    } else {
      openPreventModal();
    }
  };

  const handleLayerClose = () => {
    closePreventModal();
    onClose();
  };

  const handleChange = (value, field) => {
    setFormState(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    const contentUpdates = getMappedContentUpdates(fields, options);
    const contentUpdateBody = getContentUpdatesBody({
      bulkOperationId: null,
      contentUpdates,
    });

    const ruleDetails = contentUpdateBody.bulkOperationRules.map(item => item.rule_details);

    onSave({
      name,
      description,
      locked,
      entityType,
      ruleDetails
    });
  };

  const appIcon = <AppIcon app="bulk-edit" iconKey={friendlyEntityType} />;
  const paneTitle = intl.formatMessage(
    { id: 'ui-bulk-edit.settings.profiles.title.new' },
    { entityType: friendlyEntityType }
  );
  const paneFooter = (
    (
      <PaneFooter
        renderStart={(
          <Button
            buttonStyle="default mega"
            id="close-profiles-form"
            marginBottom0
            onClick={handleTryClose}
          >
            <FormattedMessage id="stripes-components.cancel" />
          </Button>
        )}
        renderEnd={(
          <Button
            buttonStyle="primary mega"
            id="save-profile"
            marginBottom0
            onClick={handleSave}
            type="submit"
            disabled={isSaveDisabled}
          >
            <FormattedMessage id="stripes-components.saveAndClose" />
          </Button>
        )}
      />
    )
  );

  return (
    <Pane
      defaultWidth="fill"
      paneTitle={paneTitle}
      appIcon={appIcon}
      dismissible
      footer={paneFooter}
      onClose={handleTryClose}
    >
      <AccordionSet>
        <Layout className="flex justify-end padding-bottom-gutter">
          <ExpandAllButton />
        </Layout>
        <Accordion
          label={intl.formatMessage({ id: 'ui-bulk-edit.settings.profiles.title.summary' })}
        >
          <Row>
            <Col xs={6}>
              <TextField
                label={intl.formatMessage({ id: 'ui-bulk-edit.settings.profiles.form.name' })}
                value={name}
                required
                onChange={(event) => handleChange(event.target.value, 'name')}
              />
            </Col>
            <Col xs={6}>
              <Layout className="margin-start-gutter">
                <fieldset>
                  <Label for="lockProfile">{intl.formatMessage({ id: 'ui-bulk-edit.settings.profiles.form.lockProfile' })}</Label>
                  <Checkbox
                    id="lockProfile"
                    name="lockProfile"
                    inline
                    checked={locked}
                    onChange={() => handleChange(!locked, 'locked')}
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
                onChange={(event) => handleChange(event.target.value, 'description')}
              />
            </Col>
          </Row>
        </Accordion>
        <Accordion
          label={intl.formatMessage({ id: 'ui-bulk-edit.layer.title' })}
        >
          {areAllOptionsLoaded ? (
            <>
              <InAppFormTitle
                fields={fields}
              />
              <InAppFormBody
                fields={fields}
                setFields={setFields}
                options={options}
                recordType={entityType}
                approach={APPROACHES.IN_APP}
              />
            </>
          ) : (
            <Layout className="display-flex centerContent">
              <Loading size="large" />
            </Layout>
          )}
        </Accordion>
      </AccordionSet>

      <PreventFormCloseModal
        open={preventModalOpen}
        onClose={handleLayerClose}
        onKeepEditing={closePreventModal}
      />
    </Pane>
  );
};

BulkEditProfilesForm.propTypes = {
  entityType: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
};
