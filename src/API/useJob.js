import {
  useQuery,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

export const useJob = (id, options = {}) => {
  const ky = useOkapiKy();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['progress', id],
    queryFn: () => ky.get(`data-export-spring/jobs/${id}`).json(),
    enabled: !!id,
    ...options,
  });

  return {
    data,
    isLoading,
    refetch,
  };
};
