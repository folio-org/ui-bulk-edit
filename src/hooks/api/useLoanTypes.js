import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';
import { useErrorMessages } from '../useErrorMessages';
import { MOD_INVENTORY_STORAGE } from '../../constants';

export const LOAN_TYPES_KEY = 'LOAN_TYPES_KEY';

export const useLoanTypes = (options = {}) => {
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: LOAN_TYPES_KEY });
  const { showExternalModuleError } = useErrorMessages();

  const { data, isLoading } = useQuery(
    {
      queryKey: [namespaceKey],
      cacheTime: Infinity,
      staleTime: Infinity,
      queryFn: () => ky.get('loan-types?query=cql.allRecords%3D1%20sortby%20name&limit=1000').json(),
      onError: (error) => showExternalModuleError(MOD_INVENTORY_STORAGE, error),
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
