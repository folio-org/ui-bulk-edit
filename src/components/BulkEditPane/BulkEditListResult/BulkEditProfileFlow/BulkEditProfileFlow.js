import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Modal, PaneHeader } from '@folio/stripes/components';

import { Preloader } from '@folio/stripes-data-transfer-components';
import { AppIcon } from '@folio/stripes/core';

import { BulkEditProfilesSearchAndView } from '../../../BulkEditProfiles/BulkEditProfilesSearchAndView';
import { useProfilesFlow } from '../../../../hooks/useProfilesFlow';
import { useSearchParams } from '../../../../hooks';
import { BulkEditPreviewModalFooter } from '../BulkEditInAppPreviewModal/BulkEditPreviewModalFooter';
import { BulkEditPreviewModal } from '../BulkEditInAppPreviewModal/BulkEditPreviewModal';
import { useConfirmChanges } from '../../../../hooks/useConfirmChanges';
import { useContentUpdate } from '../../../../hooks/api';
import { useCommitChanges } from '../../../../hooks/useCommitChanges';
import { RECORD_TYPES_MAPPING, RECORD_TYPES_PROFILES_MAPPING } from '../../../../constants';
import css from '../../BulkEditPane.css';

export const BulkEditProfileFlow = ({ open, bulkOperationId, onClose, onOpen }) => {
  const { currentRecordType } = useSearchParams();
  const { contentUpdate } = useContentUpdate({ id: bulkOperationId });

  const {
    isPreviewModalOpened,
    isJobPreparing,
    isPreviewSettled,
    bulkDetails,
    totalRecords,
    confirmChanges,
    closePreviewModal,
    changePreviewSettled,
  } = useConfirmChanges({ bulkOperationId });

  const {
    sortOrder,
    sortDirection,
    filteredProfiles,
    isProfilesLoading,
    isUsersLoading,
    searchTerm,
    changeSearch,
    changeLSorting,
    clearProfilesState
  } = useProfilesFlow(currentRecordType);

  const { commitChanges, isCommitting } = useCommitChanges({
    bulkOperationId,
    onChangesCommited: () => {
      closePreviewModal();
    }
  });

  const handleClose = () => {
    onClose();
    clearProfilesState();
  };

  const handleApplyProfile = (_, profile) => {
    const bulkOperationRules = profile.ruleDetails.map(rule => ({
      bulkOperationId,
      rule_details: rule
    }));

    confirmChanges([
      contentUpdate({ bulkOperationRules, totalRecords })
    ]);

    handleClose();
  };

  const handleKeepEditing = () => {
    closePreviewModal();
    onOpen();
  };

  const isLoading = isProfilesLoading || isUsersLoading;
  const isCsvFileReady = bulkDetails?.linkToModifiedRecordsCsvFile && isPreviewSettled;

  const modalHeader = (
    <PaneHeader
      className={css.modalHeader}
      paneTitle={(
        <FormattedMessage
          id="ui-bulk-edit.previewModal.selectProfiles"
          values={{ entityType: RECORD_TYPES_PROFILES_MAPPING[currentRecordType] }}
        />)}
      paneSub={(
        <FormattedMessage
          id="ui-bulk-edit.settings.profiles.paneSub"
          values={{ count: filteredProfiles?.length }}
        />
      )}
      appIcon={(
        <AppIcon
          app="bulk-edit"
          iconKey={RECORD_TYPES_MAPPING[currentRecordType]}
          size="small"
        />
      )}
    />
  );

  return (
    <>
      <Modal
        size="large"
        open={open}
        label={modalHeader}
        aria-label="PreviewModal"
        dismissible
        onClose={handleClose}
      >
        {isLoading ? (
          <Preloader />
        ) : (
          <BulkEditProfilesSearchAndView
            entityType={currentRecordType}
            isLoading={isLoading}
            profiles={filteredProfiles}
            searchTerm={searchTerm}
            sortOrder={sortOrder}
            sortDirection={sortDirection}
            onRowClick={handleApplyProfile}
            onSearchChange={changeSearch}
            onSortingChange={changeLSorting}
            autosize={false}
            maxHeight={600}
          />
        )}
      </Modal>

      <BulkEditPreviewModal
        isJobPreparing={isJobPreparing}
        isPreviewSettled={isPreviewSettled}
        onPreviewSettled={changePreviewSettled}
        onKeepEditing={handleKeepEditing}
        open={isPreviewModalOpened}
        modalFooter={
          <BulkEditPreviewModalFooter
            bulkDetails={bulkDetails}
            buttonsDisabled={!isCsvFileReady || isCommitting}
            onCommitChanges={commitChanges}
            onKeepEditing={handleKeepEditing}
          />
        }
      />
    </>
  );
};

BulkEditProfileFlow.propTypes = {
  open: PropTypes.bool.isRequired,
  bulkOperationId: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
};
