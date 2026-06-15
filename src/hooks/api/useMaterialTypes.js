import { useQuery } from 'react-query';

import { useNamespace, useOkapiKy, useStripes } from '@folio/stripes/core';

import { useErrorMessages } from '../useErrorMessages';


export const MATERIAL_TYPES_KEY = 'MATERIAL_TYPES_KEY';

export const useMaterialTypes = (options = {}) => {
  const stripes = useStripes();
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: MATERIAL_TYPES_KEY });
  const path = 'material-types';
  const { showExternalModuleError } = useErrorMessages({ path });

  const { data, isLoading } = useQuery(
    {
      queryKey: [namespaceKey],
      cacheTime: Infinity,
      staleTime: Infinity,
      queryFn: () => ky.get(path, { searchParams: { query: 'cql.allRecords=1 sortby name', limit: stripes.config.maxUnpagedResourceCount } }).json(),
      onError: showExternalModuleError,
      ...options,
    },
  );

  if (data) {
    return {
      materialTypes: data.mtypes.map(type => ({ label: type.name, value: type.id })),
      isLoading,
    };
  }

  return {
    materialTypes: [],
    isLoading,
  };
};

