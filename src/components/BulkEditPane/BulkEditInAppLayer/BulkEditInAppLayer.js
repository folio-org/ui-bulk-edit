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
import {
  QUERY_KEY_DOWNLOAD_PREVIEW_MODAL,
  useContentUpdate,
} from '../../../hooks/api';
import { useConfirmChanges } from '../../../hooks/useConfirmChanges';
import { savePreviewFile } from '../../../utils/files';
import { useOptionsWithTenants } from '../../../hooks/useOptionsWithTenants';


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
    downloadFile,
    confirmChanges,
    closePreviewModal,
  } = useConfirmChanges({
    queryDownloadKey: QUERY_KEY_DOWNLOAD_PREVIEW_MODAL,
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
    onInAppLayerClose();
  };

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
        onDownload={downloadFile}
        onKeepEditing={closePreviewModal}
        onChangesCommited={handleChangesCommited}
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
