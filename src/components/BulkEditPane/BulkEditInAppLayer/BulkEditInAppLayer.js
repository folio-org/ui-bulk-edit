import React from 'react';
import PropTypes from 'prop-types';

import { BulkEditLayer } from '../BulkEditListResult/BulkEditInAppLayer/BulkEditLayer';
import { BulkEditInApp } from '../BulkEditListResult/BulkEditInApp/BulkEditInApp';
import { BulkEditPreviewModal } from '../BulkEditListResult/BulkEditInAppPreviewModal/BulkEditPreviewModal';
import { getContentUpdatesBody } from '../BulkEditListResult/BulkEditInApp/ContentUpdatesForm/helpers';
import { QUERY_KEY_DOWNLOAD_PREVIEW_MODAL, useContentUpdate } from '../../../hooks/api';
import { useConfirmChanges } from '../../../hooks/useConfirmChanges';


export const BulkEditInAppLayer = ({
  bulkOperationId,
  contentUpdates,
  setContentUpdates,
  isInAppLayerOpen,
  paneProps,
  isInAppFormValid,
  closeInAppLayer,
}) => {
  const { contentUpdate } = useContentUpdate({ id: bulkOperationId });

  const {
    isPreviewModalOpened,
    isPreviewLoading,
    bulkDetails,
    totalRecords,
    downloadFile,
    confirmChanges,
    closePreviewModal,
  } = useConfirmChanges({
    queryDownloadKey: QUERY_KEY_DOWNLOAD_PREVIEW_MODAL,
    updateFn: contentUpdate,
    bulkOperationId,
  });

  const handleChangesCommited = () => {
    closePreviewModal();
    closeInAppLayer();
  };

  const handleConfirm = () => {
    const contentUpdatesBody = getContentUpdatesBody({
      bulkOperationId,
      contentUpdates,
      totalRecords,
    });

    confirmChanges({ contentUpdates: contentUpdatesBody });
  };

  return (
    <>
      <BulkEditLayer
        isLayerOpen={isInAppLayerOpen}
        isConfirmDisabled={!isInAppFormValid}
        onLayerClose={closeInAppLayer}
        onConfirm={handleConfirm}
        {...paneProps}
      >
        <BulkEditInApp
          onContentUpdatesChanged={setContentUpdates}
        />
      </BulkEditLayer>

      <BulkEditPreviewModal
        isPreviewLoading={isPreviewLoading}
        bulkDetails={bulkDetails}
        open={isPreviewModalOpened}
        onDownload={downloadFile}
        onKeepEditing={closePreviewModal}
        onChangesCommited={handleChangesCommited}
      />
    </>
  );
};

BulkEditInAppLayer.propTypes = {
  bulkOperationId: PropTypes.string,
  contentUpdates: PropTypes.object,
  setContentUpdates: PropTypes.func,
  isInAppLayerOpen: PropTypes.bool,
  isPreviewModalOpened: PropTypes.bool,
  paneProps: PropTypes.object,
  isInAppFormValid: PropTypes.bool,
  closeInAppLayer: PropTypes.func,
  openInAppPreviewModal: PropTypes.func,
  closeInAppPreviewModal: PropTypes.func,
  closePreviewAndLayer: PropTypes.func,
};
