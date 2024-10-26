import { useState } from 'react';
import { useQueryClient } from 'react-query';

import { useNamespace } from '@folio/stripes/core';

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


export const useConfirmChanges = ({
  updateFn,
  queryDownloadKey,
  bulkOperationId,
  onDownloadSuccess,
}) => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const { showErrorMessage } = useErrorMessages();
  const [namespaceKey] = useNamespace({ key: BULK_OPERATION_DETAILS_KEY });

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

  const confirmChanges = (payload) => {
    // as backend reset a status to 'DATA_MODIFICATION' only after the job started
    // we need to set it manually to show the preview modal without a delay
    queryClient.setQueryData(
      [BULK_OPERATION_DETAILS_KEY, namespaceKey, bulkOperationId],
      (preBulkOperation) => ({ ...preBulkOperation, status: JOB_STATUSES.DATA_MODIFICATION })
    );

    setIsPreviewModalOpened(true);
    setIsPreviewLoading(true);

    updateFn(payload)
      .then(() => bulkOperationStart({
        id: bulkOperationId,
        approach: APPROACHES.IN_APP,
        step: EDITING_STEPS.EDIT,
      }))
      .then((response) => {
        showErrorMessage(response);

        queryClient.invalidateQueries(PREVIEW_MODAL_KEY);
      })
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
