import { useQuery } from 'react-query';

import { useNamespace, useOkapiKy, useStripes } from '@folio/stripes/core';

import { useErrorMessages } from '../useErrorMessages';
import { mapAndSortStatisticalCodes } from '../../utils/helpers';


export const STATISTICAL_CODES_KEY = 'STATISTICAL_CODES_KEY';

export const useStatisticalCodes = (options = {}) => {
  const stripes = useStripes();
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: STATISTICAL_CODES_KEY });
  const { showErrorMessage } = useErrorMessages();

  const sharedParams = { searchParams: { query: 'cql.allRecords=1', limit: stripes.config.maxUnpagedResourceCount } };

  const { data, isLoading: isStatisticalCodesLoading } = useQuery(
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
      select: mapAndSortStatisticalCodes,
      onError: showErrorMessage,
      ...options,
    },
  );

  const statisticalCodes = data || [];

  return {
    statisticalCodes,
    isStatisticalCodesLoading,
  };
};
