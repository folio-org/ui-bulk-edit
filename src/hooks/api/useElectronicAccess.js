import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';
import { useErrorMessages } from '../useErrorMessages';

export const ELECTRONIC_ACCESS_RELATIONSHIPS_KEY = 'ELECTRONIC_ACCESS_RELATIONSHIPS_KEY';

export const useElectronicAccessRelationships = (options = {}) => {
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: ELECTRONIC_ACCESS_RELATIONSHIPS_KEY });
  const { showErrorMessage } = useErrorMessages();

  const { data, isLoading: isElectronicAccessLoading } = useQuery(
    {
      queryKey: [namespaceKey],
      cacheTime: Infinity,
      staleTime: Infinity,
      queryFn: () => ky.get('electronic-access-relationships?limit=1000&query=cql.allRecords=1 sortby name').json(),
      onError: showErrorMessage,
      onSuccess: showErrorMessage,
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
