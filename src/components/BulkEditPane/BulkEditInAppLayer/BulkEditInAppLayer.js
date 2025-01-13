import React, { useState } from 'react';
import PropTypes from 'prop-types';

import { BulkEditLayer } from '../BulkEditListResult/BulkEditInAppLayer/BulkEditLayer';
import { BulkEditInApp } from '../BulkEditListResult/BulkEditInApp/BulkEditInApp';
import { BulkEditPreviewModal } from '../BulkEditListResult/BulkEditInAppPreviewModal/BulkEditPreviewModal';
import {
  getContentUpdatesBody,
  getMappedContentUpdates,
  isContentUpdatesFormValid
} from '../BulkEditListResult/BulkEditInApp/ContentUpdatesForm/helpers';
import { useContentUpdate } from '../../../hooks/api';
import { useConfirmChanges } from '../../../hooks/useConfirmChanges';
import { useOptionsWithTenants } from '../../../hooks/useOptionsWithTenants';
import { BulkEditPreviewModalFooter } from '../BulkEditListResult/BulkEditInAppPreviewModal/BulkEditPreviewModalFooter';
import { useCommitChanges } from '../../../hooks/useCommitChanges';


export const BulkEditInAppLayer = ({
  bulkOperationId,
  isInAppLayerOpen,
  paneProps,
  onInAppLayerClose,
}) => {
  const [fields, setFields] = useState([]);

  const { contentUpdate } = useContentUpdate({ id: bulkOperationId });
  const { options, areAllOptionsLoaded } = useOptionsWithTenants(bulkOperationId);

  const contentUpdates = getMappedContentUpdates(fields, options);
  const isInAppFormValid = isContentUpdatesFormValid(contentUpdates);

  const {
    isPreviewModalOpened,
    isPreviewLoading,
    bulkDetails,
    totalRecords,
    confirmChanges,
    closePreviewModal,
  } = useConfirmChanges({ bulkOperationId });

  const { commitChanges } = useCommitChanges({
    bulkOperationId,
    onChangesCommited: () => {
      closePreviewModal();
      onInAppLayerClose();
    }
  });

  const isCsvFileReady = bulkDetails?.linkToModifiedRecordsCsvFile
    || !isPreviewLoading;

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
        isConfirmDisabled={!isInAppFormValid}
        onLayerClose={onInAppLayerClose}
        onConfirm={handleConfirm}
        {...paneProps}
      >
        <BulkEditInApp
          fields={fields}
          setFields={setFields}
          options={options}
          areAllOptionsLoaded={areAllOptionsLoaded}
        />
      </BulkEditLayer>

      <BulkEditPreviewModal
        isPreviewLoading={isPreviewLoading}
        bulkDetails={bulkDetails}
        open={isPreviewModalOpened}
        modalFooter={
          <BulkEditPreviewModalFooter
            bulkOperationId={bulkOperationId}
            buttonsDisabled={!isCsvFileReady}
            onCommitChanges={commitChanges}
            onKeepEditing={closePreviewModal}
          />
        }
      />
    </>
  );
};

BulkEditInAppLayer.propTypes = {
  bulkOperationId: PropTypes.string,
  isInAppLayerOpen: PropTypes.bool,
  paneProps: PropTypes.object,
  onInAppLayerClose: PropTypes.func,
};
