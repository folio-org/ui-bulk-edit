import { useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

export const useErrorsPreview = ({ id }) => {
  const ky = useOkapiKy();

  const { data, isLoading } = useQuery(
    {
      queryKey: ['previewErrors', id],
      queryFn: () => ky.get(`bulk-operations/${id}/errors`, { searchParams: { limit: 10 } }).json(),
      enabled: !!id,
    },
  );

  return { data, isLoading };
};
