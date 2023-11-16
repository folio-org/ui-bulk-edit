import { useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';

export const useElectronicAccessRelationships = (options = {}) => {
  const ky = useOkapiKy();

  const { data, isLoading: isElectronicAccessLoading } = useQuery(
    {
      queryKey: 'electronicAccess',
      cacheTime: Infinity,
      staleTime: Infinity,
      queryFn: () => ky.get('electronic-access-relationships?limit=1000&query=cql.allRecords=1 sortby name').json(),
      ...options,
    },
  );

  const electronicAccessRelationships = data?.electronicAccessRelationships?.map((item) => ({
    label: item.name,
    value: item.id,
  })) || [];

  return {
    electronicAccessRelationships,
    isElectronicAccessLoading,
  };
};
