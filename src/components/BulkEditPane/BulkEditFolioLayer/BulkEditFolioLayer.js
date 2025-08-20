import React from 'react';
import PropTypes from 'prop-types';

import { BulkEditLayer } from '../BulkEditListResult/BulkEditInAppLayer/BulkEditLayer';
import { BulkEditInApp } from '../BulkEditListResult/BulkEditInApp/BulkEditInApp';
import { BulkEditPreviewModal } from '../BulkEditListResult/BulkEditInAppPreviewModal/BulkEditPreviewModal';
import {
  getContentUpdatesBody,
  folioFieldTemplate,
  getMappedContentUpdates
} from '../BulkEditListResult/BulkEditInApp/helpers';
import { useBulkOperationTenants, useContentUpdate } from '../../../hooks/api';
import { useConfirmChanges } from '../../../hooks/useConfirmChanges';
import { useOptionsWithTenants } from '../../../hooks/useOptionsWithTenants';
import { BulkEditPreviewModalFooter } from '../BulkEditListResult/BulkEditInAppPreviewModal/BulkEditPreviewModalFooter';
import { useCommitChanges } from '../../../hooks/useCommitChanges';
import { useBulkEditForm } from '../../../hooks/useBulkEditForm';
import { validationSchema } from '../BulkEditListResult/BulkEditInApp/validation';
import { useSearchParams } from '../../../hooks';
import { TenantsProvider } from '../../../context/TenantsContext';


export const BulkEditFolioLayer = ({
  bulkOperationId,
  isInAppLayerOpen,
  paneProps,
  onInAppLayerClose,
}) => {
  const { currentRecordType } = useSearchParams();
  const { contentUpdate } = useContentUpdate({ id: bulkOperationId });
  const { bulkOperationTenants, isTenantsLoading } = useBulkOperationTenants(bulkOperationId);
  const { options, areAllOptionsLoaded } = useOptionsWithTenants(currentRecordType, bulkOperationTenants);
  const { fields, setFields, isValid } = useBulkEditForm({
    validationSchema,
    template: folioFieldTemplate
  });
  const contentUpdates = getMappedContentUpdates(fields, options);

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

  const { commitChanges, isCommitting } = useCommitChanges({
    bulkOperationId,
    onChangesCommited: () => {
      closePreviewModal();
      onInAppLayerClose();
    }
  });

  const isCsvFileReady = bulkDetails?.linkToModifiedRecordsCsvFile && isPreviewSettled;

  const handleConfirm = () => {
    const contentUpdateBody = getContentUpdatesBody({
      bulkOperationId,
      contentUpdates,
      totalRecords,
    });

    confirmChanges([
      contentUpdate(contentUpdateBody)
    ]);
  };

  return (
    <>
      <BulkEditLayer
        isLayerOpen={isInAppLayerOpen}
        isConfirmDisabled={!isValid}
        isLoading={isTenantsLoading}
        onLayerClose={onInAppLayerClose}
        onConfirm={handleConfirm}
        {...paneProps}
      >
        <TenantsProvider tenants={bulkOperationTenants} showLocal>
          <BulkEditInApp
            fields={fields}
            setFields={setFields}
            options={options}
            areAllOptionsLoaded={areAllOptionsLoaded}
          />
        </TenantsProvider>
      </BulkEditLayer>

      <BulkEditPreviewModal
        isJobPreparing={isJobPreparing}
        isPreviewSettled={isPreviewSettled}
        onPreviewSettled={changePreviewSettled}
        onKeepEditing={closePreviewModal}
        open={isPreviewModalOpened}
        modalFooter={
          <BulkEditPreviewModalFooter
            bulkDetails={bulkDetails}
            buttonsDisabled={!isCsvFileReady || isCommitting}
            onCommitChanges={commitChanges}
            onKeepEditing={closePreviewModal}
          />
        }
      />
    </>
  );
};

BulkEditFolioLayer.propTypes = {
  bulkOperationId: PropTypes.string,
  isInAppLayerOpen: PropTypes.bool,
  paneProps: PropTypes.shape({}),
  onInAppLayerClose: PropTypes.func,
};
