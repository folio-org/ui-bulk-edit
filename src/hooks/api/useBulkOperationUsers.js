import { useQuery } from 'react-query';
import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { QUERY_CAPABILITIES } from '../../constants';

export const BULK_OPERATION_USERS_KEY = 'BULK_OPERATION_USERS_KEY';

const buildQuery = (types) => {
  if (types.length === 0) {
    return `("${QUERY_CAPABILITIES.USER}" or "${QUERY_CAPABILITIES.ITEM}" or "${QUERY_CAPABILITIES.HOLDINGS_RECORD}" or "${QUERY_CAPABILITIES.INSTANCE}")`;
  }
  const includedCapabilities = types.map(type => `"${QUERY_CAPABILITIES[type]}"`).join(' or ');
  return `(${includedCapabilities})`;
};

export const useBulkOperationUsers = (entityType = [], options) => {
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: BULK_OPERATION_USERS_KEY });

  const queryFn = () => {
    const query = buildQuery(entityType);
    return ky.get(`bulk-operations/list-users?query=(entityType==${query})&offset=0`).json();
  };

  const { data, isLoading } = useQuery({
    queryKey: [namespaceKey, entityType],
    queryFn,
    ...options,
  });

  return {
    data,
    isLoading,
  };
};
