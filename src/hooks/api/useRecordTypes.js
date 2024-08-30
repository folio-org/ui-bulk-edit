import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';

export const ENTITY_TYPE_KEY = 'ENTITY_TYPE_KEY';

export const useRecordTypes = ({ enabled } = {}) => {
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: ENTITY_TYPE_KEY });

  const { data, isLoading, error } = useQuery({
    queryKey: [namespaceKey],
    queryFn: async () => {
      const response = await ky.get('entity-types');

      return (await response.json()).entityTypes;
    },
    cacheTime: Infinity,
    staleTime: Infinity,
    enabled
  });

  return ({
    recordTypes: data,
    isLoading,
    error
  });
};
