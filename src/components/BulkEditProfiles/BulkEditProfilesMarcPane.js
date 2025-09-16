import React from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { AppIcon, useStripes } from '@folio/stripes/core';

import { AccordionSet, ExpandAllButton, Layout, Pane } from '@folio/stripes/components';
import { getAdministrativeDataOptions, RECORD_TYPES_MAPPING } from '../../constants';
import { useBulkEditForm } from '../../hooks/useBulkEditForm';
import {
  validationSchema as administrativeSchema
} from '../BulkEditPane/BulkEditListResult/BulkEditInApp/validation';
import {
  folioFieldTemplate,
  getContentUpdatesBody,
  getMappedContentUpdates
} from '../BulkEditPane/BulkEditListResult/BulkEditInApp/helpers';
import { validationSchema as marcSchema } from '../BulkEditPane/BulkEditListResult/BulkEditMarc/validation';
import { marcFieldTemplate } from '../BulkEditPane/BulkEditListResult/BulkEditMarc/helpers';
import { filterOptionsByPermissions } from '../../utils/helpers';
import { sortAlphabetically } from '../../utils/sortAlphabetically';
import { BulkEditProfilesFormFooter } from './forms/BulkEditProfilesFormFooter';
import { BulkEditProfilesSummaryForm } from './forms/BulkEditProfilesSummaryForm';
import { useProfilesSummaryForm } from '../../hooks/useProfilesSummaryForm';
import { useBulkPermissions, useSearchParams } from '../../hooks';
import { BulkEditProfilesMarcForm } from './forms/BulkEditProfilesMarcForm';


export const BulkEditProfilesMarcPane = ({ title, initialSummaryValues, initialRuleDetails, initialMarcRuleDetails, isLoading, onSave, onClose, onOpenModal }) => {
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
    const contentUpdateBody = isAdministrativeFormValid ? getContentUpdatesBody({
      bulkOperationId: null,
      contentUpdates,
    }) : [];
    const marcRuleDetails = isMarcFormValid ? marcFields.map((item) => ({
      bulkOperationId: null,
      ...item
    })) : [];
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
        <BulkEditProfilesMarcForm
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

BulkEditProfilesMarcPane.propTypes = {
  initialSummaryValues: PropTypes.shape({
    description: PropTypes.string,
    entityType: PropTypes.string,
    locked: PropTypes.bool,
    name: PropTypes.string,
  }),
  initialRuleDetails: PropTypes.arrayOf(PropTypes.shape({})),
  initialMarcRuleDetails: PropTypes.arrayOf(PropTypes.shape({})),
  isLoading: PropTypes.bool,
  onClose: PropTypes.func,
  onSave: PropTypes.func,
  onOpenModal: PropTypes.func,
  title: PropTypes.string,
};
