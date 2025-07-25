import { useQuery } from 'react-query';

import { useNamespace, useOkapiKy, useStripes } from '@folio/stripes/core';

import { useErrorMessages } from '../useErrorMessages';


export const ELECTRONIC_ACCESS_RELATIONSHIPS_KEY = 'ELECTRONIC_ACCESS_RELATIONSHIPS_KEY';

export const useElectronicAccess = (options = {}) => {
  const stripes = useStripes();
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: ELECTRONIC_ACCESS_RELATIONSHIPS_KEY });
  const path = 'electronic-access-relationships';
  const { showExternalModuleError } = useErrorMessages({ path });

  const { data, isLoading: isElectronicAccessLoading } = useQuery(
    {
      queryKey: [namespaceKey],
      cacheTime: Infinity,
      staleTime: Infinity,
      queryFn: () => ky.get(path, { searchParams: { query: 'cql.allRecords=1 sortby name', limit: stripes.config.maxUnpagedResourceCount } }).json(),
      onError: showExternalModuleError,
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
