import { useQuery } from 'react-query';
import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { FILTER_KEYS } from '../constants/core';
import { useErrorMessages } from '../../../hooks/useErrorMessages';
import { MOD_PERMISSIONS } from '../../../constants';

export const ALL_PERMISSIONS_KEY = 'ALL_PERMISSIONS_KEY';

export const useAllPermissions = (options = {}) => {
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: ALL_PERMISSIONS_KEY });
  const { showExternalModuleError } = useErrorMessages();

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
      onError: (error) => showExternalModuleError(MOD_PERMISSIONS, error),
      ...options,
    },
  );

  return {
    permissions,
    isPermissionsLoading,
  };
};
