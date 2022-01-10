import { useState } from 'react';
import {
  useQuery,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

export const useDownloadLinks = (id) => {
  const ky = useOkapiKy();

  const { data } = useQuery('error-download', {
    queryFn: () => ky.get(`data-export-spring/jobs/${id}`).json(),
    enabled: !!id && id !== 'progress',
  });

  return {
    data,
  };
};

export const useProgressStatus = (id, interval) => {
  const [refetchInterval, setRefetchInterval] = useState(interval);

  const ky = useOkapiKy();

  const { data } = useQuery('progress', {
    queryFn: () => ky.get(`data-export-spring/jobs/${id}`).json(),
    enabled: !!id && id !== 'progress',
    refetchInterval,
    onSuccess: () => {
      if (data?.status === 'SUCCESSFUL') {
        setRefetchInterval(0);
      }
    },
  });

  return {
    data,
  };
};
