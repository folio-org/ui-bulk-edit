import { useState } from 'react';
import { useQueryClient } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import {
  PREVIEW_MODAL_KEY,
  BULK_OPERATION_DETAILS_KEY,
  useBulkOperationDetails,
  useBulkOperationStart,
} from './api';
import {
  APPROACHES,
  EDITING_STEPS,
  JOB_STATUSES,
} from '../constants';

import { useErrorMessages } from './useErrorMessages';
import { pollForStatus } from '../utils/pollForStatus';

export const useConfirmChanges = ({ bulkOperationId }) => {
  const queryClient = useQueryClient();
  const ky = useOkapiKy();
  const { showErrorMessage } = useErrorMessages();

  const [isPreviewModalOpened, setIsPreviewModalOpened] = useState(false);
  const [isJobPreparing, setIsJobPreparing] = useState(false);
  const [isPreviewSettled, setIsPreviewSettled] = useState(false);

  const { bulkDetails } = useBulkOperationDetails({ id: bulkOperationId });
  const { bulkOperationStart } = useBulkOperationStart();

  const totalRecords = bulkDetails?.totalNumOfRecords;

  const openPreviewModal = () => {
    setIsPreviewModalOpened(true);
  };

  const closePreviewModal = () => {
    setIsPreviewSettled(false);
    setIsPreviewModalOpened(false);
  };

  const changePreviewSettled = () => {
    setIsPreviewSettled(true);
  };

  const confirmChanges = (updateSequence) => {
    setIsJobPreparing(true);

    queryClient.removeQueries(PREVIEW_MODAL_KEY);
    queryClient.setQueriesData(
      BULK_OPERATION_DETAILS_KEY,
      (preBulkOperation) => ({ ...preBulkOperation, status: JOB_STATUSES.DATA_MODIFICATION }),
    );

    openPreviewModal();

    pollForStatus(ky, bulkOperationId)
      .then(updateSequence)
      .then(() => bulkOperationStart({
        id: bulkOperationId,
        approach: APPROACHES.IN_APP,
        step: EDITING_STEPS.EDIT,
      }))
      .then(showErrorMessage)
      .catch((error) => {
        showErrorMessage(error);
        closePreviewModal();
      })
      .finally(() => {
        setIsJobPreparing(false);
      });
  };

  return {
    totalRecords,
    bulkDetails,
    isPreviewModalOpened,
    isJobPreparing,
    isPreviewSettled,
    changePreviewSettled,
    openPreviewModal,
    closePreviewModal,
    confirmChanges,
  };
};
