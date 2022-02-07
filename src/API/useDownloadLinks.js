import {
  useQuery,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

export const useDownloadLinks = (id) => {
  const ky = useOkapiKy();

  const { data } = useQuery({
    queryKey: ['error-download', id],
    queryFn: () => ky.get(`data-export-spring/jobs/${id}`).json(),
    enabled: !!id,
  });

  return {
    data,
  };
};
