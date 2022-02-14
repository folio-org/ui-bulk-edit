import {
  useQuery,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

export const usePreviewRecords = (id) => {
  const ky = useOkapiKy();
  const { data } = useQuery(
    {
      queryKey: ['previewRecords', id],
      queryFn: async () => {
        const { users, totalRecords } = await ky.get(`bulk-edit/${id}/preview`, { searchParams: { limit: 10 } }).json();

        return {
          users,
          totalRecords,
        };
      },
      enabled: !!id,
    },
  );

  return ({
    users: data?.users || [],
    totalRecords: data?.totalRecords,
  });
};
