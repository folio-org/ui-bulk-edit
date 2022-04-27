import {
  useQuery,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

export const useInAppDownloadPreview = (id, downloadTrigger) => {
  const ky = useOkapiKy();
  const { data } = useQuery(
    {
      queryKey: ['InAppDownloadPreview', id],
      queryFn: () => ky.get(`bulk-edit/${id}/preview/updated-items/download`).json(),
      enabled: !!id && downloadTrigger,
    },
  );

  return { data };
};
