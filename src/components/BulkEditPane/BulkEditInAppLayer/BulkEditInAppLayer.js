import React from 'react';
import PropTypes from 'prop-types';

import { BulkEditLayer } from '../BulkEditListResult/BulkEditInAppLayer/BulkEditLayer';
import { BulkEditInApp } from '../BulkEditListResult/BulkEditInApp/BulkEditInApp';
import { BulkEditInAppPreviewModal } from '../BulkEditListResult/BulkEditInAppPreviewModal/BulkEditInAppPreviewModal';

const BulkEditInAppLayer = ({
  bulkOperationId,
  contentUpdates,
  setContentUpdates,
  isInAppLayerOpen,
  isPreviewModalOpened,
  paneProps,
  isInAppFormValid,
  closeInAppLayer,
  openInAppPreviewModal,
  closeInAppPreviewModal,
  closePreviewAndLayer,
}) => {
  return (
    <>
      <BulkEditLayer
        isLayerOpen={isInAppLayerOpen}
        isConfirmDisabled={!isInAppFormValid}
        onLayerClose={closeInAppLayer}
        onConfirm={openInAppPreviewModal}
        {...paneProps}
      >
        <BulkEditInApp
          onContentUpdatesChanged={setContentUpdates}
        />
      </BulkEditLayer>

      {isPreviewModalOpened && (
        <BulkEditInAppPreviewModal
          bulkOperationId={bulkOperationId}
          open={isPreviewModalOpened}
          contentUpdates={contentUpdates}
          onKeepEditing={closeInAppPreviewModal}
          onChangesCommited={closePreviewAndLayer}
        />
      )}
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

export default BulkEditInAppLayer;
