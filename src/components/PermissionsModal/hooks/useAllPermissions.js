import { useQuery } from 'react-query';
import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { FILTER_KEYS } from '../constants/core';

export const ALL_PERMISSIONS_KEY = 'ALL_PERMISSIONS_KEY';

export const useAllPermissions = (options = {}) => {
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: ALL_PERMISSIONS_KEY });

  const { data: permissions, isLoading: isPermissionsLoading } = useQuery(
    {
      queryKey: [namespaceKey],
      cacheTime: Infinity,
      staleTime: Infinity,
      queryFn: () => ky.get('perms/permissions?length=10000&query=(visible==true)').json(),
      select: (data) => data?.permissions.map((permission) => ({
        ...permission,
        type: permission.mutable ? FILTER_KEYS.PERMISSION_SETS : FILTER_KEYS.PERMISSIONS,
      })),
      ...options,
    },
  );

  return {
    permissions,
    isPermissionsLoading,
  };
};
