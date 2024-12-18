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
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const { bulkDetails } = useBulkOperationDetails({ id: bulkOperationId });
  const { bulkOperationStart } = useBulkOperationStart();

  const totalRecords = bulkDetails?.totalNumOfRecords;

  const openPreviewModal = () => {
    setIsPreviewModalOpened(true);
  };

  const closePreviewModal = () => {
    setIsPreviewModalOpened(false);
  };

  const confirmChanges = (updaters) => {
    setIsPreviewLoading(true);

    queryClient.removeQueries(PREVIEW_MODAL_KEY);
    queryClient.setQueriesData(
      BULK_OPERATION_DETAILS_KEY,
      (preBulkOperation) => ({ ...preBulkOperation, status: JOB_STATUSES.DATA_MODIFICATION }),
    );

    openPreviewModal();

    pollForStatus(ky, bulkOperationId)
      .then(() => Promise.all(updaters))
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
        setIsPreviewLoading(false);
      });
  };

  return {
    totalRecords,
    bulkDetails,
    isPreviewModalOpened,
    isPreviewLoading,
    setIsPreviewLoading,
    openPreviewModal,
    closePreviewModal,
    confirmChanges,
  };
};
