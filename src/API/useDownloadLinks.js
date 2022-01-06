import {
  useQuery,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

export const useDownloadLinks = (id) => {
  const ky = useOkapiKy();

  const { data } = useQuery('error-download', {
    queryFn: () => ky.get(`data-export-spring/jobs/${id}`).json(),
    enabled: !!id,
  });

  return {
    data,
  };
};

export const useProgressStatus = (id, refetchInterval, setRefetchInerval) => {
  const ky = useOkapiKy();

  const { data } = useQuery('progress', {
    queryFn: () => ky.get(`data-export-spring/jobs/${id}`).json(),
    enabled: !!id,
    refetchInterval,
    onSuccess: () => {
      if (data?.status === 'SUCCESSFUL') {
        setRefetchInerval(0);
      }
    },
  });

  return {
    data,
  };
};
