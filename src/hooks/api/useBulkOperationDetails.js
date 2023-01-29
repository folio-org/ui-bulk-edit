import { useState } from 'react';
import { useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';
import { useHistory } from 'react-router-dom';
import { buildSearch } from '@folio/stripes-acq-components';

export const useBulkOperationDetails = ({
  id,
  interval = 0,
}) => {
  const ky = useOkapiKy();
  const history = useHistory();

  const [refetchInterval, setRefetchInterval] = useState(interval);

  const { data, isLoading } = useQuery({
    queryKey: ['bulkOperationDetails', id],
    queryFn: () => ky.get(`bulk-operations/${id}`).json(),
    enabled: !!id,
    refetchInterval,
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
