import { useState } from 'react';
import { useQuery } from 'react-query';
import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { useHistory } from 'react-router-dom';
import { buildSearch } from '@folio/stripes-acq-components';
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
  const { checkErrorMessage } = useErrorMessages();
  const [refetchInterval, setRefetchInterval] = useState(interval);

  const { data, isLoading } = useQuery({
    queryKey: [BULK_OPERATION_DETAILS_KEY, namespaceKey, id, refetchInterval, ...additionalQueryKeys],
    enabled: !!id,
    refetchInterval,
    onSuccess: checkErrorMessage,
    queryFn: () => ky.get(`bulk-operations/${id}`).json(),
    ...options,
  });

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

  return {
    bulkDetails: data,
    isLoading,
    clearInterval,
    clearIntervalAndRedirect,
  };
};
