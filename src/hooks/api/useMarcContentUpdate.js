import { useMutation } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';
import { useErrorMessages } from '../useErrorMessages';

export const useMarcContentUpdate = ({ id }) => {
  const ky = useOkapiKy();
  const { showErrorMessage } = useErrorMessages();

  const { data, mutateAsync: marcContentUpdate, isLoading } = useMutation({
    mutationFn: (json) => {
      return ky.post(`bulk-operations/${id}/marc-content-update`, {
        json,
      }).json();
    },
    onError: showErrorMessage,
    onSuccess: showErrorMessage,
  });

  return { marcContentUpdate, isLoading, data };
};
