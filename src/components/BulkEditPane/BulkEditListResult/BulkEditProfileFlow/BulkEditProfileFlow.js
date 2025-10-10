import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Loading, Modal, PaneHeader } from '@folio/stripes/components';

import { Preloader } from '@folio/stripes-data-transfer-components';
import { AppIcon, useStripes } from '@folio/stripes/core';

import { BulkEditProfilesSearchAndView } from '../../../BulkEditProfiles/BulkEditProfilesSearchAndView';
import { useProfilesFlow } from '../../../../hooks/useProfilesFlow';
import { BulkEditPreviewModalFooter } from '../BulkEditInAppPreviewModal/BulkEditPreviewModalFooter';
import { BulkEditPreviewModal } from '../BulkEditInAppPreviewModal/BulkEditPreviewModal';
import { useConfirmChanges } from '../../../../hooks/useConfirmChanges';
import { useContentUpdate, useMarcContentUpdate } from '../../../../hooks/api';
import { useCommitChanges } from '../../../../hooks/useCommitChanges';
import {
  OPTIONS,
  APPROACHES,
  CAPABILITIES,
  LOCATION_OPTIONS,
  RECORD_TYPES_MAPPING,
  RECORD_TYPES_PROFILES_MAPPING
} from '../../../../constants';
import { APPLYING_PROFILE_VISIBLE_COLUMNS } from '../../../BulkEditProfiles/constants';
import { useSearchParams } from '../../../../hooks';
import { useTenants } from '../../../../context/TenantsContext';
import css from '../../BulkEditPane.css';

const MAX_HEIGHT = 600;

const filterProfilesByPermission = (profiles, stripes) => {
  const hasRecordsForDeletePermission = stripes.hasPerm('ui-inventory.instance.set-records-for-deletion.execute');

  return profiles?.filter(profile => {
    // If there are no rules, no need to check permissions
    if (!profile.ruleDetails?.length) return true;

    // Check each rule, if any rule requires a permission the user doesn't have, filter out the profile
    return profile.ruleDetails?.every(rule => {
      if (rule.option === OPTIONS.SET_RECORDS_FOR_DELETE) {
        return hasRecordsForDeletePermission;
      }

      return true;
    });
  });
};

export const BulkEditProfileFlow = ({ open, bulkOperationId, onClose, onOpen }) => {
  const stripes = useStripes();
  const { contentUpdate } = useContentUpdate({ id: bulkOperationId });
  const { marcContentUpdate } = useMarcContentUpdate({ id: bulkOperationId });
  const { approach, currentRecordType, setParam } = useSearchParams();
  const { tenants } = useTenants();
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

  const profilesFilteredByPerms = filterProfilesByPermission(filteredProfiles, stripes);

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
    // If tenants are present in entity, they should be replaced with bulk operation tenants
    const nestedTenants = (entity, key) => (entity[key]?.length ? tenants : entity[key]);

    const bulkOperationRules = profile.ruleDetails.map(rule => {
      // Location rules do not require tenants modification
      if (LOCATION_OPTIONS.includes(rule.option)) {
        return {
          bulkOperationId,
          rule_details: rule
        };
      }

      return {
        bulkOperationId,
        rule_details: {
          ...rule,
          tenants: nestedTenants(rule, 'tenants'),
          actions: rule.actions.map(action => ({
            ...action,
            tenants: nestedTenants(action, 'tenants'),
            updated_tenants: nestedTenants(action, 'updated_tenants'),
          })),
        }
      };
    });

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

  const paneSub = isLoading ? <Loading /> : (
    (
      <FormattedMessage
        id="ui-bulk-edit.settings.profiles.paneSub"
        values={{ count: profilesFilteredByPerms?.length }}
      />
    )
  );

  const modalHeader = (
    <PaneHeader
      className={css.modalHeader}
      paneTitle={(
        <FormattedMessage
          id="ui-bulk-edit.previewModal.selectProfiles"
          values={{ entityType: RECORD_TYPES_PROFILES_MAPPING[entityType] }}
        />)}
      paneSub={paneSub}
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
            profiles={profilesFilteredByPerms}
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
  bulkOperationId: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  onOpen: PropTypes.func.isRequired,
};
