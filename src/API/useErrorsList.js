import {
  useQuery,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import { useEffect, useState } from 'react';
import { usePulling } from './usePulling';

export const useErrorsList = (id) => {
  const ky = useOkapiKy();

  const [errors, setErrors] = useState();

  const { refetchInterval } = usePulling({
    dependencies: [errors],
    stopCondition: errors?.length,
  });

  const { data } = useQuery(
    {
      queryKey: ['previewErrors', id],
      queryFn: () => ky.get(`bulk-edit/${id}/errors`, { searchParams: { limit: 10 } }).then(response => response.json()),
      enabled: !!id,
      refetchInterval,
    },
  );

  useEffect(() => {
    if (data?.errors) {
      setErrors(data.errors);
    }
  }, [data]);

  return ({
    errors,
  });
};
