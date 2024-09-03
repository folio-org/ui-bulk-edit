import { useMutation } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';
import { useErrorMessages } from '../useErrorMessages';

export const useMarkContentUpdate = ({ id }) => {
  const ky = useOkapiKy();
  const { showErrorMessage } = useErrorMessages();

  const { data, mutateAsync: markContentUpdate, isLoading } = useMutation({
    mutationFn: (json) => {
      return ky.post(`bulk-operations/${id}/marc-content-update`, {
        json,
      });
    },
    onSuccess: showErrorMessage,
  });

  return { markContentUpdate, isLoading, data };
};
