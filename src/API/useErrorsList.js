import {
  useQuery,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import { useEffect, useState } from 'react';
import { usePulling } from '../hooks/usePulling';

export const useErrorsList = (id) => {
  const ky = useOkapiKy();

  const [errors, setErrors] = useState();

  const { data } = useQuery(
    {
      queryKey: ['previewErrors', id],
      queryFn: () => ky.get(`bulk-edit/${id}/errors`, { searchParams: { limit: 10 } }).then(response => response.json()),
      enabled: !!id,
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
