import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Modal, PaneHeader } from '@folio/stripes/components';

import { Preloader } from '@folio/stripes-data-transfer-components';
import { AppIcon } from '@folio/stripes/core';

import { BulkEditProfilesSearchAndView } from '../../../BulkEditProfiles/BulkEditProfilesSearchAndView';
import { useProfilesFlow } from '../../../../hooks/useProfilesFlow';
import { BulkEditPreviewModalFooter } from '../BulkEditInAppPreviewModal/BulkEditPreviewModalFooter';
import { BulkEditPreviewModal } from '../BulkEditInAppPreviewModal/BulkEditPreviewModal';
import { useConfirmChanges } from '../../../../hooks/useConfirmChanges';
import { useContentUpdate } from '../../../../hooks/api';
import { useCommitChanges } from '../../../../hooks/useCommitChanges';
import { APPROACHES, CAPABILITIES, RECORD_TYPES_MAPPING, RECORD_TYPES_PROFILES_MAPPING } from '../../../../constants';
import { APPLYING_PROFILE_VISIBLE_COLUMNS } from '../../../BulkEditProfiles/constants';
import { useMarcContentUpdate } from '../../../../hooks/api/useMarcContentUpdate';
import { useSearchParams } from '../../../../hooks';
import css from '../../BulkEditPane.css';

const MAX_HEIGHT = 600;

export const BulkEditProfileFlow = ({ open, bulkOperationId, onClose, onOpen }) => {
  const { contentUpdate } = useContentUpdate({ id: bulkOperationId });
  const { marcContentUpdate } = useMarcContentUpdate({ id: bulkOperationId });
  const { approach, currentRecordType, setParam } = useSearchParams();
  const entityType = approach === APPROACHES.MARC ? CAPABILITIES.INSTANCE_MARC : currentRecordType;

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
  } = useProfilesFlow([entityType], { enabled: open, keepPreviousData: open });

  const { commitChanges, isCommitting } = useCommitChanges({
    bulkOperationId,
    onChangesCommited: () => {
      closePreviewModal();
    }
  });

  const handleClose = () => {
    onClose();
    clearProfilesState();
    setParam('approach', null);
  };

  const handleApplyProfile = (_, profile) => {
    const bulkOperationRules = profile.ruleDetails.map(rule => ({
      bulkOperationId,
      rule_details: rule
    }));

    if (profile.entityType === CAPABILITIES.INSTANCE_MARC) {
      const bulkOperationMarcRules = profile.marcRuleDetails.map((item) => ({
        bulkOperationId,
        ...item
      }));

      const updateSequence = () => contentUpdate({
        bulkOperationRules,
        totalRecords
      }).then(() => marcContentUpdate({
        bulkOperationMarcRules,
        totalRecords,
      }));

      confirmChanges(updateSequence);
    } else {
      confirmChanges([
        contentUpdate({
          bulkOperationRules,
          totalRecords
        })
      ]);
    }

    onClose();
  };

  const handleKeepEditing = () => {
    closePreviewModal();
    onOpen(approach);
  };

  const isLoading = isProfilesLoading || isUsersLoading;
  const isCsvFileReady = bulkDetails?.linkToModifiedRecordsCsvFile && isPreviewSettled;

  const modalHeader = (
    <PaneHeader
      className={css.modalHeader}
      paneTitle={(
        <FormattedMessage
          id="ui-bulk-edit.previewModal.selectProfiles"
          values={{ entityType: RECORD_TYPES_PROFILES_MAPPING[entityType] }}
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
          iconKey={RECORD_TYPES_MAPPING[entityType]}
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
            entityType={entityType}
            isLoading={isLoading}
            profiles={filteredProfiles}
            searchTerm={searchTerm}
            sortOrder={sortOrder}
            sortDirection={sortDirection}
            onRowClick={handleApplyProfile}
            onSearchChange={changeSearch}
            onSortingChange={changeLSorting}
            autosize={false}
            maxHeight={MAX_HEIGHT}
            visibleColumns={APPLYING_PROFILE_VISIBLE_COLUMNS}
          />
        )}
      </Modal>

      <BulkEditPreviewModal
        entityType={entityType}
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
