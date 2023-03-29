import { useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';
import { FileInfo } from './types';

export const useFileDownload = ({
  id,
  fileInfo,
  onSuccess,
  ...queryProps,
} : {
  id: string,
  fileInfo: FileInfo,
  onSuccess: () => void;
}) => {
  const ky = useOkapiKy();

  const { refetch } = useQuery(
    {
      queryKey: ['downloadFile', id, fileInfo],
      queryFn: () => ky.get(`bulk-operations/${id}/download`, {
        searchParams: { fileContentType: fileInfo?.fileContentType },
      }).blob(),
      enabled: !!fileInfo,
      onSuccess,
      ...queryProps,
    },
  );

  return { refetch };
};
