import React from 'react';
import PropTypes from 'prop-types';

import { BulkEditLayer } from '../BulkEditListResult/BulkEditInAppLayer/BulkEditLayer';
import { BulkEditInApp } from '../BulkEditListResult/BulkEditInApp/BulkEditInApp';
import { BulkEditPreviewModal } from '../BulkEditListResult/BulkEditInAppPreviewModal/BulkEditPreviewModal';
import { getContentUpdatesBody } from '../BulkEditListResult/BulkEditInApp/ContentUpdatesForm/helpers';
import { QUERY_KEY_DOWNLOAD_PREVIEW_MODAL, useContentUpdate } from '../../../hooks/api';
import { useConfirmChanges } from '../../../hooks/useConfirmChanges';
import { savePreviewFile } from '../../../utils/files';


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
    bulkDetails,
    totalRecords,
    downloadFile,
    confirmChanges,
    closePreviewModal,
    isPreviewLoading,
    setIsPreviewLoading,
    isReadyToShowPreview,
  } = useConfirmChanges({
    queryDownloadKey: QUERY_KEY_DOWNLOAD_PREVIEW_MODAL,
    updateFn: contentUpdate,
    bulkOperationId,
    onDownloadSuccess: (fileData, searchParams) => {
      const { approach, initialFileName } = searchParams;

      savePreviewFile({
        bulkOperationId,
        fileData,
        approach,
        initialFileName,
      });
    },
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

  const handlePreviewLoaded = () => {
    setIsPreviewLoading(false);
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
        isReadyToShowPreview={isReadyToShowPreview}
        bulkDetails={bulkDetails}
        open={isPreviewModalOpened}
        onDownload={downloadFile}
        onKeepEditing={closePreviewModal}
        onChangesCommited={handleChangesCommited}
        onPreviewLoaded={handlePreviewLoaded}
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
