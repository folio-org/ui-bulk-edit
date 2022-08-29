import { useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';

export const useLoanTypes = () => {
  const ky = useOkapiKy();

  const { data, isLoading } = useQuery(
    {
      queryKey: 'loanTypes',
      queryFn: () => ky.get('loan-types?query=cql.allRecords%3D1%20sortby%20name&limit=1000').json(),
    },
  );

  if (data) {
    return {
      loanTypes: data.loantypes.map(type => ({ label: type.name, value: type.name })),
      isLoading,
    };
  }

  return {
    loanTypes: [],
    isLoading,
  };
};
