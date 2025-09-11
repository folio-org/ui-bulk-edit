import { Accordion, AccordionSet, ExpandAllButton, Layout, Pane } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import { AppIcon } from '@folio/stripes/core';
import { BulkEditProfilesSummaryForm } from './BulkEditProfilesSummaryForm';
import { APPROACHES, RECORD_TYPES_MAPPING } from '../../../constants';
import { InAppForm } from '../../BulkEditPane/BulkEditListResult/BulkEditInApp/InAppForm/InAppForm';
import { useBulkPermissions, useSearchParams } from '../../../hooks';
import { useOptionsWithTenants } from '../../../hooks/useOptionsWithTenants';
import { useBulkEditForm } from '../../../hooks/useBulkEditForm';
import { validationSchema } from '../../BulkEditPane/BulkEditListResult/BulkEditInApp/validation';
import {
  folioFieldTemplate,
  getContentUpdatesBody,
  getMappedContentUpdates
} from '../../BulkEditPane/BulkEditListResult/BulkEditInApp/helpers';
import { BulkEditProfilesFormFooter } from './BulkEditProfilesFormFooter';
import { useProfilesSummaryForm } from '../../../hooks/useProfilesSummaryForm';

export const BulkEditProfilesInAppForm = ({ title, initialSummaryValues, initialRuleDetails, isLoading, onSave, onClose, onOpenModal }) => {
  const { hasSettingsLockPerms } = useBulkPermissions();
  const { currentRecordType: entityType } = useSearchParams();
  const { options, areAllOptionsLoaded } = useOptionsWithTenants(entityType);
  const { fields, setFields, isValid: areContentUpdatesValid, isPristine: isContentUpdatePristine } = useBulkEditForm({
    validationSchema,
    initialValues: initialRuleDetails,
    template: folioFieldTemplate,
  });
  const { formState, setFormState, isValid, isPristine } = useProfilesSummaryForm({ initialSummaryValues, entityType });
  const isFullFormPristine = isPristine && isContentUpdatePristine;
  const isSaveDisabled = !areContentUpdatesValid || !isValid || isFullFormPristine;

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
        <Accordion
          label={<FormattedMessage id="ui-bulk-edit.layer.title" />}
        >
          <InAppForm
            fields={fields}
            setFields={setFields}
            options={options}
            recordType={entityType}
            approach={APPROACHES.IN_APP}
            loading={!areAllOptionsLoaded}
            derivedFieldsConfig={{ isActive: !isContentUpdatePristine }}
          />
        </Accordion>
      </AccordionSet>
    </Pane>
  );
};
