import {
  useQuery,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

export const usePreviewRecords = (id, capabilities, options = {}) => {
  const ky = useOkapiKy();
  const { data } = useQuery(
    {
      queryKey: ['previewRecords', id],
      queryFn: async () => {
        const { users, items, totalRecords } = await ky.get(`bulk-edit/${id}/preview/${capabilities}`, { searchParams: { limit: 10 } }).json();

        return {
          users,
          items,
          totalRecords,
        };
      },
      enabled: !!id,
      ...options,
    },
  );

  return ({
    items: data?.users || data?.items || [],
    totalRecords: data?.totalRecords,
  });
};
