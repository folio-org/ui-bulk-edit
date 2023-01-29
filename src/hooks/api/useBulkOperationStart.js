import { useOkapiKy } from '@folio/stripes/core';
import { useMutation } from 'react-query';

export const useBulkOperationStart = ({ approachType, ...queryParams }) => {
  const ky = useOkapiKy();

  const { mutateAsync: bulkOperationStart, isLoading } = useMutation({
    mutationFn: ({ id }) => {
    // TODO: approachType=IN_APP will be replaced with manual=true/false
      const searchParams = new URLSearchParams({
        approachType,
      }).toString();

      return ky.post(`bulk-operations/${id}/start?${searchParams}`, {}).json();
    },
    retry: 10,
    retryDelay: 2000,
    ...queryParams,
  });

  return {
    bulkOperationStart,
    isLoading,
  };
};
