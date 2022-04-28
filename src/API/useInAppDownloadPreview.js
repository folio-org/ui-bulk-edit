import {
  useQuery,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

export const useInAppDownloadPreview = (id) => {
  const ky = useOkapiKy();
  const { data, refetch } = useQuery(
    {
      queryKey: ['InAppDownloadPreview', id],
      queryFn: () => ky.get(`bulk-edit/${id}/preview/updated-items/download`).json(),
      enabled: false,
    },
  );

  return { data, refetch };
};
