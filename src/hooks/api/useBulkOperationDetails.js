import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { useHistory } from 'react-router-dom';
import { buildSearch } from '@folio/stripes-acq-components';

export const BULK_OPERATION_DETAILS_KEY = 'BULK_OPERATION_DETAILS_KEY';

export const useBulkOperationDetails = ({
  id,
  interval = 0,
  additionalQueryKeys = [],
  shouldRefetch = false,
  ...options
}) => {
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: BULK_OPERATION_DETAILS_KEY });
  const history = useHistory();
  const { data, isLoading, refetch } = useQuery({
    queryKey: [BULK_OPERATION_DETAILS_KEY, namespaceKey, id],
    enabled: !!id,
    queryFn: () => ky.get(`bulk-operations/${id}`).json(),
    ...options,
  });

  useEffect(() => {
    let intervalId;

    if (shouldRefetch) {
      intervalId = setInterval(() => {
        refetch();
      }, interval);
    }

    return () => {
      clearInterval(intervalId);
    };
  }, [shouldRefetch, interval, refetch]);

  const clearIntervalAndRedirect = (pathname, searchParams) => {
    history.replace({
      pathname,
      search: searchParams ? buildSearch(searchParams, history.location.search) : '',
    });
  };

  return {
    bulkDetails: data,
    isLoading,
    refetch,
    clearIntervalAndRedirect,
  };
};
