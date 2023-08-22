import { useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';
import { CAPABILITIES } from '../../constants';

export const useBulkOperationUsers = (options) => {
  const ky = useOkapiKy();

  const { data, isLoading } = useQuery({
    queryKey: ['bulkOperationUsers'],
    queryFn: () => ky.get(`bulk-operations/list-users?query=(entityType==("${CAPABILITIES.USER}" or "${CAPABILITIES.ITEM}" or "${CAPABILITIES.HOLDING}"))&limit=100&offset=0`).json(),
    ...options,
  });

  return {
    data,
    isLoading,
  };
};
