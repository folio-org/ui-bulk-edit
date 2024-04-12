import { useQuery } from 'react-query';
import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { CAPABILITIES } from '../../constants';

export const BULK_OPERATION_USERS_KEY = 'BULK_OPERATION_USERS_KEY';

export const useBulkOperationUsers = (options) => {
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: BULK_OPERATION_USERS_KEY });

  const { data, isLoading } = useQuery({
    queryKey: [namespaceKey],
    queryFn: () => ky.get(`bulk-operations/list-users?query=(entityType==("${CAPABILITIES.USER}" or "${CAPABILITIES.ITEM}" or "${CAPABILITIES.HOLDING}"))&offset=0`).json(),
    ...options,
  });

  return {
    data,
    isLoading,
  };
};
