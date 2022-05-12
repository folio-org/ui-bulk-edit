import {
  useQuery,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import { useEffect, useState } from 'react';
import { usePulling } from '../hooks/usePulling';

export const useDownloadLinks = (id) => {
  const ky = useOkapiKy();

  const [job, setJob] = useState();

  const { refetchInterval } = usePulling({
    dependencies: [job],
    stopCondition: job?.files?.length,
  });

  const { data, isLoading, refetch } = useQuery({
    queryKey: 'getJob',
    queryFn: () => ky.get(`data-export-spring/jobs/${id}`).json(),
    enabled: !!id,
    refetchInterval,
  });

  useEffect(() => {
    if (data) {
      setJob(data);
    }
  }, [data]);

  return {
    data,
    isLoading,
    refetch,
  };
};
