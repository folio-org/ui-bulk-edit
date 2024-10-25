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
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const { bulkDetails } = useBulkOperationDetails({ id: bulkOperationId, interval: 0 });
  const { bulkOperationStart } = useBulkOperationStart();

  const totalRecords = bulkDetails?.totalNumOfRecords;

  const openPreviewModal = () => {
    setIsPreviewModalOpened(true);
  };

  const closePreviewModal = () => {
    setIsPreviewModalOpened(false);
  };

  const confirmChanges = (payload) => {
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
