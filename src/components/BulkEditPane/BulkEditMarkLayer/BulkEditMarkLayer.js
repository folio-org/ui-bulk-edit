import React, { useContext } from 'react';
import PropTypes from 'prop-types';

import { BulkEditLayer } from '../BulkEditListResult/BulkEditInAppLayer/BulkEditLayer';
import { BulkEditMark } from '../BulkEditListResult/BulkEditMark/BulkEditMark';
import { BulkEditPreviewModal } from '../BulkEditListResult/BulkEditInAppPreviewModal/BulkEditPreviewModal';
import { getTransformedField } from '../BulkEditListResult/BulkEditMark/helpers';
import { RootContext } from '../../../context/RootContext';
import { useMarkContentUpdate } from '../../../hooks/api/useMarkContentUpdate';
import { useConfirmChanges } from '../../../hooks/useConfirmChanges';
import { QUERY_KEY_DOWNLOAD_MARK_PREVIEW_MODAL } from '../../../hooks/api';
import { savePreviewFile } from '../../../utils/files';


export const BulkEditMarkLayer = ({
  bulkOperationId,
  isMarkLayerOpen,
  isMarkFieldsValid,
  closeMarkLayer,
  paneProps,
}) => {
  const { fields } = useContext(RootContext);
  const { markContentUpdate } = useMarkContentUpdate({ id: bulkOperationId });

  const {
    isPreviewModalOpened,
    isPreviewLoading,
    bulkDetails,
    totalRecords,
    downloadFile,
    confirmChanges,
    closePreviewModal,
    setIsPreviewLoading,
    isReadyToShowPreview,
  } = useConfirmChanges({
    updateFn: markContentUpdate,
    queryDownloadKey: QUERY_KEY_DOWNLOAD_MARK_PREVIEW_MODAL,
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
    closeMarkLayer();
  };

  const handleConfirm = () => {
    const bulkOperationMarcRules = fields
      .map(field => ({
        bulkOperationId,
        ...getTransformedField(field),
      }));

    confirmChanges({
      bulkOperationMarcRules,
      totalRecords,
    });
  };

  const handlePreviewLoaded = () => {
    setIsPreviewLoading(false);
  };

  return (
    <>
      <BulkEditLayer
        isLayerOpen={isMarkLayerOpen}
        isConfirmDisabled={!isMarkFieldsValid}
        onLayerClose={closeMarkLayer}
        onConfirm={handleConfirm}
        {...paneProps}
      >
        <BulkEditMark />
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

BulkEditMarkLayer.propTypes = {
  bulkOperationId: PropTypes.string,
  isMarkLayerOpen: PropTypes.bool,
  isMarkFieldsValid: PropTypes.bool,
  closeMarkLayer: PropTypes.func,
  paneProps: PropTypes.object,
};
