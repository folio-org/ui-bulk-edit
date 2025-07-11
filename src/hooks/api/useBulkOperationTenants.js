import { useQuery } from 'react-query';

import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { useErrorMessages } from '../useErrorMessages';
import { usePathParams } from '../usePathParams';

export const BULK_TENANTS_KEY = 'BULK_TENANTS_KEY';

export const useBulkOperationTenants = () => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: BULK_TENANTS_KEY });
  const { id } = usePathParams('/bulk-edit/:id');
  const { showExternalModuleError } = useErrorMessages();

  const { data: tenants, isLoading: isTenantsLoading } = useQuery({
    queryKey: [namespace],
    queryFn: () => ky.get(`bulk-operations/used-tenants/${id}`).json(),
    keepPreviousData: true,
    cacheTime: Infinity,
    staleTime: Infinity,
    enabled: !!id,
    onError: showExternalModuleError,
  });

  return {
    tenants,
    isTenantsLoading,
  };
};
