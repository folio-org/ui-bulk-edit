import { useQuery } from 'react-query';

import { useNamespace, useOkapiKy } from '@folio/stripes/core';

import { useErrorMessages } from '../useErrorMessages';


export const STATISTICAL_CODES_KEY = 'STATISTICAL_CODES_KEY';

export const useStatisticalCodes = (options = {}) => {
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: STATISTICAL_CODES_KEY });
  const { showErrorMessage } = useErrorMessages();

  const sharedParams = { searchParams: { query: 'cql.allRecords=1', limit: 1000 } };

  const { data: statisticalCodes, isLoading: isStatisticalCodesLoading } = useQuery(
    {
      queryKey: [namespaceKey],
      cacheTime: Infinity,
      staleTime: Infinity,
      queryFn: () => Promise.all([
        ky.get('statistical-code-types', sharedParams).json()
          .then(response => response.statisticalCodeTypes),
        ky.get('statistical-codes', sharedParams).json()
          .then(response => response.statisticalCodes),
      ]),
      select: ([statisticalCodeTypes, statisticalCodesArr]) => {
        return statisticalCodesArr.map((statisticalCode) => {
          const type = statisticalCodeTypes.find((codeType) => codeType.id === statisticalCode.statisticalCodeTypeId);

          return {
            label: `${type.name}: ${statisticalCode.code} - ${statisticalCode.name}`,
            value: statisticalCode.id,
          };
        });
      },
      onError: showErrorMessage,
      ...options,
    },
  );

  return {
    statisticalCodes: statisticalCodes || [],
    isStatisticalCodesLoading,
  };
};
