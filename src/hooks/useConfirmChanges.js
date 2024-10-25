import { useState } from 'react';
import { useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';

import { useShowCallout } from '@folio/stripes-acq-components';

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


export const useConfirmChanges = ({
  updateFn,
  queryDownloadKey,
  bulkOperationId,
  onDownloadSuccess,
}) => {
  const callout = useShowCallout();
  const intl = useIntl();
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();

  const [isPreviewModalOpened, setIsPreviewModalOpened] = useState(false);
  const [isBulkOperationStarting, setIsBulkOperationStarting] = useState(false);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const { bulkDetails } = useBulkOperationDetails({
    id: bulkOperationId,
    interval: isPreviewLoading ? 3000 : 0
  });
  const { bulkOperationStart } = useBulkOperationStart();

  const totalRecords = bulkDetails?.totalNumOfRecords;

  const openPreviewModal = () => {
    setIsPreviewModalOpened(true);
  };

  const closePreviewModal = () => {
    setIsPreviewModalOpened(false);
    setIsPreviewLoading(false);
  };

  const confirmChanges = (payload) => {
    setIsBulkOperationStarting(true);
    setIsPreviewLoading(true);
    setIsPreviewModalOpened(true);

    updateFn(payload)
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

        closePreviewModal();
      })
      .finally(() => {
        setIsBulkOperationStarting(false);
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

  const isReadyToShowPreview = !isBulkOperationStarting &&
    ![JOB_STATUSES.DATA_MODIFICATION, JOB_STATUSES.DATA_MODIFICATION_IN_PROGRESS].includes(bulkDetails?.status);

  return {
    totalRecords,
    bulkDetails,
    isPreviewModalOpened,
    isBulkOperationStarting,
    setIsBulkOperationStarting,
    isReadyToShowPreview,
    isPreviewLoading,
    setIsPreviewLoading,
    isFileDownloading,
    downloadFile,
    openPreviewModal,
    closePreviewModal,
    confirmChanges,
  };
};
