import { useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

export const useBulkOperationUsers = (options) => {
  const ky = useOkapiKy();

  const { data, isLoading } = useQuery({
    queryKey: ['bulkOperationUsers'],
    queryFn: () => ky.get('bulk-operations/list-users?query=(entityType=="USER")&limit=100&offset=0').json(),
    ...options,
  });

  return {
    data,
    isLoading,
  };
};
