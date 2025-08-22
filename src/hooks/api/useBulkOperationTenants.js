import { useQuery } from 'react-query';

import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { useErrorMessages } from '../useErrorMessages';

export const BULK_TENANTS_KEY = 'BULK_TENANTS_KEY';

export const useBulkOperationTenants = (id, options) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: BULK_TENANTS_KEY });
  const { showExternalModuleError } = useErrorMessages();

  const { data: bulkOperationTenants, isLoading: isTenantsLoading } = useQuery({
    queryKey: [namespace, id],
    queryFn: () => ky.get(`bulk-operations/used-tenants/${id}`).json(),
    keepPreviousData: true,
    cacheTime: Infinity,
    staleTime: Infinity,
    onError: showExternalModuleError,
    ...options
  });

  return {
    bulkOperationTenants,
    isTenantsLoading,
  };
};
