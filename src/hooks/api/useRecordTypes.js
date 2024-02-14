import { useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';

const ENTITY_TYPE_KEY = 'entityType';

export const useRecordTypes = ({ enabled } = {}) => {
  const ky = useOkapiKy();
  const { data, isLoading, error } = useQuery({
    queryKey: [ENTITY_TYPE_KEY],
    queryFn: async () => {
      const response = await ky.get('entity-types');

      return response.json();
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
