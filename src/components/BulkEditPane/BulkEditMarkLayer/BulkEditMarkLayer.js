import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useIntl } from 'react-intl';

import { useShowCallout } from '@folio/stripes-acq-components';

import { useQueryClient } from 'react-query';
import { BulkEditLayer } from '../BulkEditListResult/BulkEditInAppLayer/BulkEditLayer';
import { BulkEditMark } from '../BulkEditListResult/BulkEditMark/BulkEditMark';
import { BulkEditPreviewModal } from '../BulkEditListResult/BulkEditInAppPreviewModal/BulkEditPreviewModal';
import {
  BULK_OPERATION_DETAILS_KEY,
  PREVIEW_MODAL_KEY,
  useBulkOperationDetails,
  useBulkOperationStart
} from '../../../hooks/api';
import { getTransformedField } from '../BulkEditListResult/BulkEditMark/helpers';
import { RootContext } from '../../../context/RootContext';
import { useMarkContentUpdate } from '../../../hooks/api/useMarkContentUpdate';
import { APPROACHES, EDITING_STEPS } from '../../../constants';


export const BulkEditMarkLayer = ({
  bulkOperationId,
  isMarkLayerOpen,
  isMarkFieldsValid,
  closeMarkLayer,
  paneProps,
}) => {
  const callout = useShowCallout();
  const intl = useIntl();
  const queryClient = useQueryClient();

  const { fields } = useContext(RootContext);

  const [openMarkPreviewModal, setOpenMarkPreviewModal] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const { bulkDetails } = useBulkOperationDetails({ id: bulkOperationId });
  const { bulkOperationStart } = useBulkOperationStart();
  const { markContentUpdate } = useMarkContentUpdate({ id: bulkOperationId });

  const totalRecords = bulkDetails?.totalNumOfRecords;

  const handleCloseMarkPreviewModal = () => {
    setOpenMarkPreviewModal(false);
  };

  const handleChangesCommited = () => {
    handleCloseMarkPreviewModal();
    closeMarkLayer();
  };

  const handleConfirm = () => {
    const bulkOperationMarcRules = fields
      .map(field => ({
        bulkOperationId,
        ...getTransformedField(field),
      }));

    markContentUpdate({
      bulkOperationMarcRules,
      totalRecords,
    }).then(() => bulkOperationStart({
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
        handleCloseMarkPreviewModal();
      })
      .finally(() => {
        setIsPreviewLoading(false);
      });
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
        bulkDetails={bulkDetails}
        open={openMarkPreviewModal}
        onKeepEditing={handleCloseMarkPreviewModal}
        onChangesCommited={handleChangesCommited}
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
