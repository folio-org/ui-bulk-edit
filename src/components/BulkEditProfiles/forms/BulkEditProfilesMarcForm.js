import { Accordion, AccordionSet, ExpandAllButton, Layout, Pane } from '@folio/stripes/components';
import { FormattedMessage, useIntl } from 'react-intl';
import React from 'react';
import { AppIcon, useStripes } from '@folio/stripes/core';
import { InAppForm } from '../../BulkEditPane/BulkEditListResult/BulkEditInApp/InAppForm/InAppForm';
import { APPROACHES, getAdministrativeDataOptions, RECORD_TYPES_MAPPING } from '../../../constants';
import { MarcForm } from '../../BulkEditPane/BulkEditListResult/BulkEditMarc/MarcForm/MarcForm';
import { useBulkEditForm } from '../../../hooks/useBulkEditForm';
import {
  validationSchema as administrativeSchema
} from '../../BulkEditPane/BulkEditListResult/BulkEditInApp/validation';
import {
  folioFieldTemplate, getContentUpdatesBody,
  getMappedContentUpdates
} from '../../BulkEditPane/BulkEditListResult/BulkEditInApp/helpers';
import { validationSchema as marcSchema } from '../../BulkEditPane/BulkEditListResult/BulkEditMarc/validation';
import { marcFieldTemplate } from '../../BulkEditPane/BulkEditListResult/BulkEditMarc/helpers';
import { filterOptionsByPermissions } from '../../../utils/helpers';
import { sortAlphabetically } from '../../../utils/sortAlphabetically';
import { BulkEditProfilesFormFooter } from './BulkEditProfilesFormFooter';
import { BulkEditProfilesSummaryForm } from './BulkEditProfilesSummaryForm';
import { useProfilesSummaryForm } from '../../../hooks/useProfilesSummaryForm';
import { useBulkPermissions, useSearchParams } from '../../../hooks';

export const BulkEditProfilesMarcForms = ({
  fields,
  setFields,
  marcFields,
  setMarcFields,
  options,
  entityType,
  isAdministrativeFormPristine,
  isNonInteractive,
}) => {
  return (
    <>
      <Accordion
        label={<FormattedMessage id="ui-bulk-edit.layer.title" />}
      >
        <InAppForm
          fields={fields}
          setFields={setFields}
          options={options}
          recordType={entityType}
          approach={APPROACHES.MARC}
          derivedFieldsConfig={{ isActive: !isAdministrativeFormPristine }}
          isNonInteractive={isNonInteractive}
        />
      </Accordion>
      <Layout className="marginTop1">
        <Accordion
          label={<FormattedMessage id="ui-bulk-edit.layer.title.marc" />}
        >
          <MarcForm
            marcFields={marcFields}
            setMarcFields={setMarcFields}
            isNonInteractive={isNonInteractive}
          />
        </Accordion>
      </Layout>
    </>
  );
};

export const BulkEditProfilesMarcForm = ({ title, initialSummaryValues, initialRuleDetails, initialMarcRuleDetails, isLoading, onSave, onClose, onOpenModal }) => {
  const stripes = useStripes();
  const intl = useIntl();
  const { hasSettingsLockPerms } = useBulkPermissions();
  const { currentRecordType: entityType } = useSearchParams();

  const { fields, setFields, isValid: isAdministrativeFormValid, isPristine: isAdministrativeFormPristine } = useBulkEditForm({
    validationSchema: administrativeSchema,
    initialValues: initialRuleDetails,
    template: folioFieldTemplate
  });

  const { fields: marcFields, setFields: setMarcFields, isValid: isMarcFormValid, isPristine: isMarcFormPristine } = useBulkEditForm({
    validationSchema: marcSchema,
    initialValues: initialMarcRuleDetails,
    template: marcFieldTemplate
  });

  const { formState, setFormState, isValid: isSummaryFormValid, isPristine } = useProfilesSummaryForm({ initialSummaryValues, entityType });

  const filteredOptions = filterOptionsByPermissions(getAdministrativeDataOptions(intl.formatMessage), stripes);
  const sortedOptions = sortAlphabetically(filteredOptions);
  const areBothFormsValid = isAdministrativeFormValid && isMarcFormValid;
  const isOnlyAdministrativeValid = isAdministrativeFormValid && isMarcFormPristine;
  const isOnlyMarcFormValid = isMarcFormValid && isAdministrativeFormPristine;
  const isFullFormPristine = isPristine && isAdministrativeFormPristine && isMarcFormPristine;
  const someOfBulkFormsValid = isOnlyAdministrativeValid || isOnlyMarcFormValid || areBothFormsValid;
  const isSaveDisabled = !someOfBulkFormsValid || !isSummaryFormValid || isFullFormPristine;

  const appIcon = <AppIcon app="bulk-edit" iconKey={RECORD_TYPES_MAPPING[entityType]} />;

  const handleTryClose = () => {
    if (isFullFormPristine) {
      onClose();
    } else {
      onOpenModal();
    }
  };

  const handleChange = (value, field) => {
    setFormState(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSave = async () => {
    const { name, description, locked } = formState;
    const contentUpdates = getMappedContentUpdates(fields, sortedOptions);
    const contentUpdateBody = getContentUpdatesBody({
      bulkOperationId: null,
      contentUpdates,
    });
    const marcRuleDetails = marcFields.map((item) => ({
      bulkOperationId: null,
      ...item
    }));
    const ruleDetails = contentUpdateBody.bulkOperationRules.map(item => item.rule_details);

    onSave({
      name,
      description,
      locked,
      entityType,
      ruleDetails,
      marcRuleDetails
    });
  };

  return (
    <Pane
      defaultWidth="fill"
      paneTitle={title}
      appIcon={appIcon}
      dismissible
      footer={(
        <BulkEditProfilesFormFooter
          onCancel={handleTryClose}
          onSave={handleSave}
          isSaveDisabled={isSaveDisabled || isLoading}
        />
      )}
      onClose={handleTryClose}
    >
      <AccordionSet>
        <Layout className="flex justify-end">
          <ExpandAllButton />
        </Layout>
        <BulkEditProfilesSummaryForm
          onChange={handleChange}
          formState={formState}
          lockedDisabled={!hasSettingsLockPerms}
        />
        <BulkEditProfilesMarcForms
          fields={fields}
          setFields={setFields}
          marcFields={marcFields}
          setMarcFields={setMarcFields}
          options={sortedOptions}
          entityType={entityType}
          isAdministrativeFormPristine={isAdministrativeFormPristine}
        />
      </AccordionSet>
    </Pane>
  );
};
