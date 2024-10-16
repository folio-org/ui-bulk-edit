import { useQuery } from 'react-query';

import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { useErrorMessages } from '../useErrorMessages';

export const BULK_TENANTS_KEY = 'BULK_TENANTS_KEY';

export const useBulkOperationTenants = (id, options = {}) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: BULK_TENANTS_KEY });
  const { showErrorMessage } = useErrorMessages();

  const { data, isLoading } = useQuery({
    queryKey: [namespace],
    queryFn: () => ky.get(`bulk-operations/used-tenants/${id}`).json(),
    keepPreviousData: true,
    onError: showErrorMessage,
    onSuccess: showErrorMessage,
    ...options,
  });

  return {
    data,
    isLoading,
  };
};
