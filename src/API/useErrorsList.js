import {
  useQuery,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import { useEffect, useState } from 'react';

export const useErrorsList = (id) => {
  const ky = useOkapiKy();
  const [refetchInterval, setRefetchInterval] = useState(1000);
  const refetchingTimeout = 20000;

  let timeout;

  const { data } = useQuery(
    {
      queryKey: ['previewErrors', id],
      queryFn: () => ky.get(`bulk-edit/${id}/errors`, { searchParams: { limit: 10 } }).then(response => response.json()),
      enabled: !!id,
      refetchInterval,
    },
  );

  useEffect(() => {
    timeout = setTimeout(() => {
      setRefetchInterval(0);
    }, refetchingTimeout);

    if (data?.errors.length) {
      setRefetchInterval(0);
    }

    return () => {
      clearTimeout(timeout);
    };
  }, [data]);

  return ({
    errors: data?.errors,
  });
};
