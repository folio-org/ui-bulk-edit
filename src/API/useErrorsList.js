import {
  useQuery,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

export const useErrorsList = (id) => {
  const ky = useOkapiKy();
  const { data } = useQuery(['previewErrors'],
    {
      queryFn: async () => {
        const { errors } = await ky.get(`bulk-edit/${id}/errors`, { searchParams: { limit: 10 } }).json();

        return errors;
      },
      enabled: !!id,
    });

  return ({
    errors: data,
  });
};
