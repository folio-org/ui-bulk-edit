import PropTypes from 'prop-types';
import React, { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { ConfirmationModal } from '@folio/stripes/components';

import { BulkEditProfilesInAppForm } from './BulkEditProfilesInAppForm';
import { useSearchParams } from '../../../hooks';
import { CAPABILITIES } from '../../../constants';
import { BulkEditProfilesMarcPane } from '../BulkEditProfilesMarcPane';

export const BulkEditProfilesForm = ({
  title,
  isLoading,
  initialValues,
  initialRuleDetails,
  initialMarcRuleDetails,
  onClose,
  onSave
}) => {
  const { currentRecordType } = useSearchParams();
  const [preventModalOpen, setPreventModalOpen] = useState(false);

  const openPreventModal = () => {
    setPreventModalOpen(true);
  };

  const closePreventModal = () => {
    setPreventModalOpen(false);
  };

  const handleLayerClose = () => {
    closePreventModal();
    onClose();
  };

  return (
    <>
      {currentRecordType === CAPABILITIES.INSTANCE_MARC ? (
        <BulkEditProfilesMarcPane
          title={title}
          isLoading={isLoading}
          initialSummaryValues={initialValues}
          initialRuleDetails={initialRuleDetails}
          initialMarcRuleDetails={initialMarcRuleDetails}
          onSave={onSave}
          onOpenModal={openPreventModal}
          onClose={onClose}
        />
      ) : (
        <BulkEditProfilesInAppForm
          initialRuleDetails={initialRuleDetails}
          initialSummaryValues={initialValues}
          isLoading={isLoading}
          onClose={onClose}
          onOpenModal={openPreventModal}
          onSave={onSave}
          title={title}
        />
      )}

      <ConfirmationModal
        open={preventModalOpen}
        heading={<FormattedMessage id="ui-bulk-edit.previewModal.areYouSure" />}
        message={<FormattedMessage id="ui-bulk-edit.previewModal.unsavedChanges" />}
        confirmLabel={<FormattedMessage id="ui-bulk-edit.previewModal.keepEditing" />}
        cancelLabel={<FormattedMessage id="ui-bulk-edit.previewModal.closeWithoutSaving" />}
        onConfirm={closePreventModal}
        onCancel={handleLayerClose}
      />
    </>
  );
};

BulkEditProfilesForm.propTypes = {
  initialRuleDetails: PropTypes.arrayOf(PropTypes.shape({})),
  initialMarcRuleDetails: PropTypes.arrayOf(PropTypes.shape({})),
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
