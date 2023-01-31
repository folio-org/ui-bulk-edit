import { useOkapiKy } from '@folio/stripes/core';
import { useMutation } from 'react-query';

export const useBulkOperationStart = (mutationOptions = {}) => {
  const ky = useOkapiKy();

  const { mutateAsync: bulkOperationStart, isLoading } = useMutation({
    mutationFn: ({ id, approach, step }) => {
      return ky.post(`bulk-operations/${id}/start`, {
        json: {
          step,
          ...(approach ? { approach } : {}),
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
