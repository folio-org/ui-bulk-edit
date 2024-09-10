import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';

export const BULK_TENANTS_KEY = 'BULK_TENANTS_KEY';

export const useBulkOperationTenants = (id, options = {}) => {
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: BULK_TENANTS_KEY });

  const { data, isLoading } = useQuery({
    queryKey: [namespaceKey],
    queryFn: () => ky.get(`bulk-operations/used-tenants/${id}`).json(),
    ...options,
  });

  return {
    data,
    isLoading,
  };
};
