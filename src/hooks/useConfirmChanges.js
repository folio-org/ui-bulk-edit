import { useState } from 'react';
import { useQueryClient } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import {
  PREVIEW_MODAL_KEY,
  BULK_OPERATION_DETAILS_KEY,
  useBulkOperationDetails,
  useBulkOperationStart,
  useFileDownload
} from './api';
import {
  APPROACHES,
  EDITING_STEPS,
  FILE_SEARCH_PARAMS,
  JOB_STATUSES,
} from '../constants';
import { useSearchParams } from './useSearchParams';

import { useErrorMessages } from './useErrorMessages';
import { pollForStatus } from '../utils/pollForStatus';

export const useConfirmChanges = ({
  updateFn,
  queryDownloadKey,
  bulkOperationId,
  onDownloadSuccess,
}) => {
  const queryClient = useQueryClient();
  const ky = useOkapiKy();
  const searchParams = useSearchParams();
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
    queryClient.resetQueries(BULK_OPERATION_DETAILS_KEY);
  };

  const confirmChanges = (payload) => {
    setIsPreviewLoading(true);

    queryClient.removeQueries(PREVIEW_MODAL_KEY);
    queryClient.setQueriesData(
      BULK_OPERATION_DETAILS_KEY,
      (preBulkOperation) => ({ ...preBulkOperation, status: JOB_STATUSES.DATA_MODIFICATION }),
    );

    openPreviewModal();
    pollForStatus(ky, bulkOperationId)
      .then(() => updateFn(payload))
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

  const { refetch: downloadFile, isFetching: isFileDownloading } = useFileDownload({
    queryKey: queryDownloadKey,
    enabled: false, // to prevent automatic file fetch in preview modal
    id: bulkOperationId,
    fileInfo: {
      fileContentType: FILE_SEARCH_PARAMS.PROPOSED_CHANGES_FILE,
    },
    onSuccess: (data) => onDownloadSuccess(data, searchParams),
  });

  return {
    totalRecords,
    bulkDetails,
    isPreviewModalOpened,
    isPreviewLoading,
    setIsPreviewLoading,
    isFileDownloading,
    downloadFile,
    openPreviewModal,
    closePreviewModal,
    confirmChanges,
  };
};
