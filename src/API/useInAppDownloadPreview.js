import {
  useQuery,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

export const useInAppDownloadPreview = (id) => {
  const ky = useOkapiKy();
  const { data, refetch, isLoading } = useQuery(
    {
      queryKey: ['InAppDownloadPreview', id],
      queryFn: () => ky.get(`bulk-edit/${id}/preview/updated-items/download`),
      enabled: false,
    },
  );

  return { data, refetch, isLoading };
};
