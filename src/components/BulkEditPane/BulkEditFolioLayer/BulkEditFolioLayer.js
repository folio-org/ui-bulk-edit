import React from 'react';
import PropTypes from 'prop-types';

import { BulkEditLayer } from '../BulkEditListResult/BulkEditInAppLayer/BulkEditLayer';
import { BulkEditFolio } from '../BulkEditListResult/BulkEditFolio/BulkEditFolio';
import { BulkEditPreviewModal } from '../BulkEditListResult/BulkEditInAppPreviewModal/BulkEditPreviewModal';
import {
  getContentUpdatesBody,
  folioFieldTemplate,
  getMappedContentUpdates
} from '../BulkEditListResult/BulkEditFolio/helpers';
import { useContentUpdate } from '../../../hooks/api';
import { useConfirmChanges } from '../../../hooks/useConfirmChanges';
import { useOptionsWithTenants } from '../../../hooks/useOptionsWithTenants';
import { BulkEditPreviewModalFooter } from '../BulkEditListResult/BulkEditInAppPreviewModal/BulkEditPreviewModalFooter';
import { useCommitChanges } from '../../../hooks/useCommitChanges';
import { useBulkEditForm } from '../../../hooks/useBulkEditForm';
import { validationSchema } from '../BulkEditListResult/BulkEditFolio/validation';


export const BulkEditFolioLayer = ({
  bulkOperationId,
  isInAppLayerOpen,
  paneProps,
  onInAppLayerClose,
}) => {
  const { contentUpdate } = useContentUpdate({ id: bulkOperationId });
  const { options, areAllOptionsLoaded } = useOptionsWithTenants();
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
        onLayerClose={onInAppLayerClose}
        onConfirm={handleConfirm}
        {...paneProps}
      >
        <BulkEditFolio
          fields={fields}
          setFields={setFields}
          options={options}
          areAllOptionsLoaded={areAllOptionsLoaded}
        />
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
