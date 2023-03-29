import { useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';
import { ErrorDto } from './types';

export const useErrorsPreview = ({ id } : { id: string }) => {
  const ky = useOkapiKy();

  const { data, isLoading } = useQuery<ErrorDto>(
    {
      queryKey: ['previewErrors', id],
      cacheTime: 0,
      enabled: !!id,
      queryFn: () => ky.get(`bulk-operations/${id}/errors`, { searchParams: { limit: 10 } }).json(),
    },
  );

  return { data, isLoading };
};
