import { useOkapiKy } from '@folio/stripes/core';
import { useMutation } from 'react-query';

export const useBulkOperationStart = (mutationOptions = {}) => {
  const ky = useOkapiKy();

  const { mutateAsync: bulkOperationStart, isLoading } = useMutation({
    mutationFn: ({ id, approach, step, query }) => {
      return ky.post(`bulk-operations/${id}/start`, {
        json: {
          step,
          ...(approach ? { approach } : {}),
          ...(query ? { query } : {}),
        },
      }).json();
    },
    ...mutationOptions,
  });

  return {
    bulkOperationStart,
    isLoading,
  };
};
