import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { useHistory } from 'react-router-dom';
import { buildSearch } from '@folio/stripes-acq-components';
import { JOB_STATUSES } from '../../constants';
import { useErrorMessages } from '../useErrorMessages';

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
  const [refetchInterval, setRefetchInterval] = useState(0);
  const { showErrorMessage } = useErrorMessages();

  const stopRefetching = () => setRefetchInterval(0);

  const fetchBulkOperationDetails = async () => {
    try {
      const response = await ky.get(`bulk-operations/${id}`).json();
      showErrorMessage(response);

      if (response.status === JOB_STATUSES.FAILED || response?.errorMessage) {
        stopRefetching();
      }

      return response;
    } catch (error) {
      showErrorMessage(error);
      stopRefetching();

      return error;
    }
  };

  const { data, isLoading, refetch } = useQuery({
    queryKey: [BULK_OPERATION_DETAILS_KEY, namespaceKey, refetchInterval, id, ...additionalQueryKeys],
    enabled: !!id,
    queryFn: fetchBulkOperationDetails,
    ...options,
  });

  useEffect(() => {
    if (!shouldRefetch || interval <= 0) return;

    const intervalId = setInterval(refetch, interval);

    return () => clearInterval(intervalId);
  }, [shouldRefetch, interval, refetch]);

  const redirectAndStopRefetching = (pathname, searchParams) => {
    stopRefetching();
    history.replace({
      pathname,
      search: searchParams ? buildSearch(searchParams, history.location.search) : '',
    });
  };

  return {
    bulkDetails: data,
    isLoading,
    refetch,
    clearIntervalAndRedirect: redirectAndStopRefetching,
  };
};
