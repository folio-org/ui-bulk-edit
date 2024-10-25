import { useState } from 'react';
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
  ...options
}) => {
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: BULK_OPERATION_DETAILS_KEY });
  const history = useHistory();
  const [refetchInterval, setRefetchInterval] = useState(interval);
  const { showErrorMessage } = useErrorMessages();

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

  const { data, isLoading } = useQuery({
    queryKey: [BULK_OPERATION_DETAILS_KEY, namespaceKey, id, refetchInterval, ...additionalQueryKeys],
    enabled: !!id,
    onError: (error) => {
      showErrorMessage(error);
      clearIntervalAndRedirect('/bulk-edit', '');
    },
    onSuccess: (response) => {
      showErrorMessage(response);

      if (response.status === JOB_STATUSES.FAILED || response?.errorMessage) {
        clearIntervalAndRedirect('/bulk-edit', '');
      }
    },
    refetchInterval,
    queryFn: () => ky.get(`bulk-operations/${id}`).json(),
    ...options,
  });

  return {
    bulkDetails: data,
    isLoading,
    clearInterval,
    clearIntervalAndRedirect,
  };
};
