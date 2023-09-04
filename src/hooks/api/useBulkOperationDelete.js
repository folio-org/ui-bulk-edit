import { useOkapiKy } from '@folio/stripes/core';
import { useMutation } from 'react-query';

export const useBulkOperationDelete = (mutationOptions = {}) => {
  const ky = useOkapiKy();

  const { mutateAsync: bulkOperationDelete, isLoading } = useMutation({
    mutationFn: async ({ id, name }) => {
      await ky.delete(`bulk-operations/${id}/files/${name}`);
    },
    ...mutationOptions,
  });

  return {
    bulkOperationDelete,
    isLoading,
  };
};
