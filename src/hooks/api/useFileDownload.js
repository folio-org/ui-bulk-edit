import { useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

export const QUERY_KEY_DOWNLOAD_LOGS = 'downloadLogs';
export const QUERY_KEY_DOWNLOAD_ACTION_MENU = 'downloadActionMenu';
export const QUERY_KEY_DOWNLOAD_IN_APP = 'downloadInApp';

export const useFileDownload = ({
  id,
  fileInfo,
  onSuccess,
  onSettled,
  queryKey,
  ...queryProps
}) => {
  const ky = useOkapiKy();

  const { refetch } = useQuery(
    {
      queryKey: [queryKey, id, fileInfo],
      queryFn: () => ky.get(`bulk-operations/${id}/download`, {
        searchParams: { fileContentType: fileInfo?.fileContentType },
      }).blob(),
      enabled: !!fileInfo,
      onSuccess,
      onSettled,
      ...queryProps,
    },
  );

  return { refetch };
};
