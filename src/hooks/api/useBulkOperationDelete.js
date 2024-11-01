import { useOkapiKy } from '@folio/stripes/core';
import { useMutation } from 'react-query';
import { useErrorMessages } from '../useErrorMessages';

export const useBulkOperationDelete = (mutationOptions = {}) => {
  const ky = useOkapiKy();
  const { showErrorMessage } = useErrorMessages();

  const { mutateAsync: bulkOperationDelete, isLoading } = useMutation({
    mutationFn: async ({ operationId }) => {
      return ky.post(`bulk-operations/${operationId}/cancel`);
    },
    onError: showErrorMessage,
    ...mutationOptions,
  });

  return {
    bulkOperationDelete,
    isLoading,
  };
};
