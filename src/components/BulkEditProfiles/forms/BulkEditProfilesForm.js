import isEqual from 'lodash/isEqual';
import PropTypes from 'prop-types';
import { useState } from 'react';
import {
  FormattedMessage,
  useIntl,
} from 'react-intl';

import {
  Accordion,
  AccordionSet,
  Button,
  Checkbox,
  Col,
  ConfirmationModal,
  ExpandAllButton,
  Label,
  Layout,
  Pane,
  PaneFooter,
  Row,
  TextArea,
  TextField
} from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';

import {
  APPROACHES,
  RECORD_TYPES_MAPPING,
} from '../../../constants';
import { useBulkPermissions } from '../../../hooks';
import { useBulkEditForm } from '../../../hooks/useBulkEditForm';
import { useOptionsWithTenants } from '../../../hooks/useOptionsWithTenants';
import { getFormErrors } from '../../../utils/helpers';
import {
  folioFieldTemplate,
  getContentUpdatesBody,
  getMappedContentUpdates,
} from '../../BulkEditPane/BulkEditListResult/BulkEditInApp/helpers';
import { InAppForm } from '../../BulkEditPane/BulkEditListResult/BulkEditInApp/InAppForm/InAppForm';
import { validationSchema } from '../../BulkEditPane/BulkEditListResult/BulkEditInApp/validation';
import { profilesValidationSchema } from './validation';

const initialFormState = (entityType) => ({
  name: '',
  description: '',
  locked: false,
  entityType,
});

export const BulkEditProfilesForm = ({
  title,
  entityType,
  initialValues,
  initialRuleDetails,
  isLoading,
  onClose,
  onSave
}) => {
  const intl = useIntl();
  const { hasSettingsLockPerms } = useBulkPermissions();
  const { options, areAllOptionsLoaded } = useOptionsWithTenants(entityType);
  const { fields, setFields, isValid: areContentUpdatesValid, isPristine: isContentUpdatePristine } = useBulkEditForm({
    validationSchema,
    initialValues: initialRuleDetails,
    template: folioFieldTemplate,
  });
  const initial = initialValues || initialFormState(entityType);
  const [preventModalOpen, setPreventModalOpen] = useState(false);
  const [formState, setFormState] = useState(initial);
  const { name, description, locked } = formState;

  const errors = getFormErrors(formState, profilesValidationSchema);
  const isFormValid = Object.keys(errors).length === 0;
  const isFormPristine = isEqual(formState, initial);
  const isFullFormPristine = isFormPristine && isContentUpdatePristine;
  const isSaveDisabled = !areContentUpdatesValid || !isFormValid || isFullFormPristine;

  const openPreventModal = () => {
    setPreventModalOpen(true);
  };

  const closePreventModal = () => {
    setPreventModalOpen(false);
  };

  const handleTryClose = () => {
    if (isFullFormPristine) {
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

  const appIcon = <AppIcon app="bulk-edit" iconKey={RECORD_TYPES_MAPPING[entityType]} />;

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
            disabled={isSaveDisabled || isLoading}
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
      paneTitle={title}
      appIcon={appIcon}
      dismissible
      footer={paneFooter}
      onClose={handleTryClose}
    >
      <AccordionSet>
        <Layout className="flex justify-end">
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
                    disabled={!hasSettingsLockPerms}
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
          <InAppForm
            fields={fields}
            setFields={setFields}
            options={options}
            recordType={entityType}
            approach={APPROACHES.IN_APP}
            loading={!areAllOptionsLoaded}
          />
        </Accordion>
      </AccordionSet>

      <ConfirmationModal
        open={preventModalOpen}
        heading={<FormattedMessage id="ui-bulk-edit.previewModal.areYouSure" />}
        message={<FormattedMessage id="ui-bulk-edit.previewModal.unsavedChanges" />}
        confirmLabel={<FormattedMessage id="ui-bulk-edit.previewModal.keepEditing" />}
        cancelLabel={<FormattedMessage id="ui-bulk-edit.previewModal.closeWithoutSaving" />}
        onConfirm={closePreventModal}
        onCancel={handleLayerClose}
      />
    </Pane>
  );
};

BulkEditProfilesForm.propTypes = {
  entityType: PropTypes.string.isRequired,
  initialRuleDetails: PropTypes.arrayOf(PropTypes.shape({})),
  initialValues: PropTypes.shape({
    description: PropTypes.string,
    entityType: PropTypes.string,
    locked: PropTypes.bool,
    name: PropTypes.string,
  }),
  isLoading: PropTypes.bool,
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
};
