import { useState } from 'react';
import { useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';
import { useHistory } from 'react-router-dom';
import { buildSearch } from '@folio/stripes-acq-components';
import { BulkOperationDto } from './types';

export const useBulkOperationDetails = ({
  id,
  interval = 0,
  additionalQueryKeys = [],
  ...options
}) => {
  const ky = useOkapiKy();
  const history = useHistory();

  const [refetchInterval, setRefetchInterval] = useState(interval);

  const { data, isLoading } = useQuery<BulkOperationDto>({
    queryKey: ['bulkOperationDetails', id, refetchInterval, ...additionalQueryKeys],
    enabled: !!id,
    refetchInterval,
    queryFn: () => ky.get(`bulk-operations/${id}`).json(),
    ...options,
  });

  const clearInterval = () => {
    setRefetchInterval(0);
  };
  const clearIntervalAndRedirect = (pathname: string, searchParams: object) => {
    clearInterval();

    history.replace({
      pathname,
      search: searchParams ? buildSearch(searchParams, history.location.search) : '',
    });
  };

  return {
    bulkDetails: data,
    isLoading,
    clearInterval,
    clearIntervalAndRedirect,
  };
};
