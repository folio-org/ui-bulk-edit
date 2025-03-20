import { useQuery } from 'react-query';

import { useNamespace, useOkapiKy, useStripes } from '@folio/stripes/core';

import { useErrorMessages } from '../useErrorMessages';


export const LOAN_TYPES_KEY = 'LOAN_TYPES_KEY';

export const useLoanTypes = (options = {}) => {
  const stripes = useStripes();
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: LOAN_TYPES_KEY });
  const path = 'loan-types';
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
      loanTypes: data.loantypes.map(type => ({ label: type.name, value: type.id })),
      isLoading,
    };
  }

  return {
    loanTypes: [],
    isLoading,
  };
};
