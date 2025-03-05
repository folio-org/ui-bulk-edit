import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { useHistory } from 'react-router-dom';
import { buildSearch } from '@folio/stripes-acq-components';

export const BULK_OPERATION_DETAILS_KEY = 'BULK_OPERATION_DETAILS_KEY';

export const useBulkOperationDetails = ({
  id,
  interval,
  additionalQueryKeys = [],
  ...options
}) => {
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: BULK_OPERATION_DETAILS_KEY });
  const history = useHistory();
  const [refetchInterval, setRefetchInterval] = useState(0);

  const clearInterval = () => {
    setRefetchInterval(0);
  };

  const clearIntervalAndRedirect = (pathname, searchParams) => {
    clearInterval();

    history.replace({
      pathname,
      search: searchParams ? buildSearch(searchParams, history.location.search) : '',
    });
  };

  useEffect(() => {
    setRefetchInterval(interval);

    return () => {
      clearInterval();
    };
  }, [interval]);

  const { data, isLoading } = useQuery({
    queryKey: [BULK_OPERATION_DETAILS_KEY, namespaceKey, id, ...additionalQueryKeys],
    enabled: !!id,
    refetchInterval,
    queryFn: () => ky.get(`bulk-operations/${id}`).json(),
    ...options,
  });

  console.log(data?.status);

  return {
    bulkDetails: data,
    isLoading,
    clearInterval,
    clearIntervalAndRedirect,
  };
};
