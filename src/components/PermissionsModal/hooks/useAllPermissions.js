import { useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';
import { FILTER_KEYS } from '../constants/core';

export const useAllPermissions = (options = {}) => {
  const ky = useOkapiKy();

  const { data: permissions, isLoading: isPermissionsLoading } = useQuery(
    {
      queryKey: 'permissionsList',
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
