import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';
import { useErrorMessages } from '../useErrorMessages';
import { MOD_FQM_MANAGER } from '../../constants';

export const ENTITY_TYPE_KEY = 'ENTITY_TYPE_KEY';

export const useRecordTypes = ({ enabled } = {}) => {
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: ENTITY_TYPE_KEY });
  const { showExternalModuleError } = useErrorMessages();

  const { data, isLoading, error } = useQuery({
    queryKey: [namespaceKey],
    queryFn: async () => {
      const response = await ky.get('entity-types');

      return (await response.json()).entityTypes;
    },
    cacheTime: Infinity,
    staleTime: Infinity,
    onError: (err) => showExternalModuleError(MOD_FQM_MANAGER, err),
    enabled
  });

  return ({
    recordTypes: data,
    isLoading,
    error
  });
};
