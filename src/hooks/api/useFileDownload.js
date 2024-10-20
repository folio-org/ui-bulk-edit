import { useQuery } from 'react-query';
import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { useErrorMessages } from '../useErrorMessages';

export const QUERY_KEY_DOWNLOAD_LOGS = 'downloadLogs';
export const QUERY_KEY_DOWNLOAD_ACTION_MENU = 'downloadActionMenu';
export const QUERY_KEY_DOWNLOAD_PREVIEW_MODAL = 'downloadPreviewModal';
export const QUERY_KEY_DOWNLOAD_MARK_PREVIEW_MODAL = 'downloadMarkPreviewModal';

export const useFileDownload = ({
  id,
  fileInfo,
  onSuccess,
  onSettled,
  queryKey,
  ...queryProps
}) => {
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: queryKey });
  const { showErrorMessage } = useErrorMessages();

  const { refetch, isFetching } = useQuery(
    {
      queryKey: [namespaceKey, id, fileInfo],
      queryFn: () => ky.get(`bulk-operations/${id}/download`, {
        searchParams: { fileContentType: fileInfo?.fileContentType },
      }).blob(),
      enabled: !!fileInfo,
      onSuccess: response => {
        showErrorMessage(response);
        onSuccess?.(response);
      },
      onError: showErrorMessage,
      onSettled,
      ...queryProps,
    },
  );

  return { refetch, isFetching };
};
