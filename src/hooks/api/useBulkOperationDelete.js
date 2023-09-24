import { useOkapiKy } from '@folio/stripes/core';
import { useMutation } from 'react-query';

export const useBulkOperationDelete = (mutationOptions = {}) => {
  const ky = useOkapiKy();

  const { mutateAsync: bulkOperationDelete, isLoading } = useMutation({
    mutationFn: async ({ operationId }) => {
      await ky.post(`bulk-operations/${operationId}/cancel`);
    },
    ...mutationOptions,
  });

  return {
    bulkOperationDelete,
    isLoading,
  };
};
