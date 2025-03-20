import { useQuery } from 'react-query';

import { useNamespace, useOkapiKy } from '@folio/stripes/core';

import { useErrorMessages } from '../useErrorMessages';


export const ENTITY_TYPE_KEY = 'ENTITY_TYPE_KEY';

export const useRecordTypes = ({ enabled } = {}) => {
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: ENTITY_TYPE_KEY });
  const path = 'entity-types';
  const { showExternalModuleError } = useErrorMessages({ path });

  const { data, isLoading, error } = useQuery({
    queryKey: [namespaceKey],
    queryFn: async () => {
      const response = await ky.get(path);

      return (await response.json()).entityTypes;
    },
    cacheTime: Infinity,
    staleTime: Infinity,
    onError: showExternalModuleError,
    enabled
  });

  return ({
    recordTypes: data,
    isLoading,
    error
  });
};
