import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';

import { useShowCallout } from '@folio/stripes-acq-components';

import { BulkEditLayer } from '../BulkEditListResult/BulkEditInAppLayer/BulkEditLayer';
import { BulkEditInApp } from '../BulkEditListResult/BulkEditInApp/BulkEditInApp';
import { BulkEditPreviewModal } from '../BulkEditListResult/BulkEditInAppPreviewModal/BulkEditPreviewModal';
import { getContentUpdatesBody } from '../BulkEditListResult/BulkEditInApp/ContentUpdatesForm/helpers';
import { APPROACHES, EDITING_STEPS } from '../../../constants';
import {
  BULK_OPERATION_DETAILS_KEY,
  PREVIEW_MODAL_KEY,
  useBulkOperationDetails,
  useBulkOperationStart,
  useContentUpdate
} from '../../../hooks/api';


export const BulkEditInAppLayer = ({
  bulkOperationId,
  contentUpdates,
  setContentUpdates,
  isInAppLayerOpen,
  paneProps,
  isInAppFormValid,
  closeInAppLayer,
}) => {
  const callout = useShowCallout();
  const intl = useIntl();
  const queryClient = useQueryClient();

  const [openInAppPreviewModal, setOpenInAppPreviewModal] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const { bulkDetails } = useBulkOperationDetails({ id: bulkOperationId });
  const { bulkOperationStart } = useBulkOperationStart();
  const { contentUpdate } = useContentUpdate({ id: bulkOperationId });

  const totalRecords = bulkDetails?.totalNumOfRecords;

  const handleCloseInAppPreviewModal = () => {
    setOpenInAppPreviewModal(false);
  };

  const handleChangesCommited = () => {
    handleCloseInAppPreviewModal();
    closeInAppLayer();
  };

  const handleConfirm = () => {
    const contentUpdatesBody = getContentUpdatesBody({
      bulkOperationId,
      contentUpdates,
      totalRecords,
    });

    setIsPreviewLoading(true);
    setOpenInAppPreviewModal(true);

    contentUpdate({ contentUpdates: contentUpdatesBody })
      .then(() => bulkOperationStart({
        id: bulkOperationId,
        approach: APPROACHES.IN_APP,
        step: EDITING_STEPS.EDIT,
      }))
      .then(() => {
        queryClient.invalidateQueries(BULK_OPERATION_DETAILS_KEY);
        queryClient.invalidateQueries(PREVIEW_MODAL_KEY);
      })
      .catch(() => {
        callout({
          type: 'error',
          message: intl.formatMessage({ id: 'ui-bulk-edit.error.sww' }),
        });
        handleCloseInAppPreviewModal();
      })
      .finally(() => {
        setIsPreviewLoading(false);
      });
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
        open={openInAppPreviewModal}
        onKeepEditing={handleCloseInAppPreviewModal}
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
