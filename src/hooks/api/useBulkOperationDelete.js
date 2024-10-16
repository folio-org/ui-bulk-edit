import { useOkapiKy } from '@folio/stripes/core';
import { useMutation } from 'react-query';
import { useErrorMessages } from '../useErrorMessages';

export const useBulkOperationDelete = (mutationOptions = {}) => {
  const ky = useOkapiKy();
  const { showErrorMessage } = useErrorMessages();

  const { mutateAsync: bulkOperationDelete, isLoading } = useMutation({
    mutationFn: async ({ operationId }) => {
      await ky.post(`bulk-operations/${operationId}/cancel`);
    },
    onError: showErrorMessage,
    onSuccess: showErrorMessage,
    ...mutationOptions,
  });

  return {
    bulkOperationDelete,
    isLoading,
  };
};
