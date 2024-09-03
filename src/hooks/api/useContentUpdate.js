import { useMutation } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';
import { useErrorMessages } from '../useErrorMessages';

export const useContentUpdate = ({ id }) => {
  const ky = useOkapiKy();
  const { showErrorMessage } = useErrorMessages();

  const { data, mutateAsync: contentUpdate, isLoading } = useMutation({
    mutationFn: ({ contentUpdates }) => {
      return ky.post(`bulk-operations/${id}/content-update`, {
        json: contentUpdates,
      });
    },
    onSuccess: showErrorMessage,
  });

  return { contentUpdate, isLoading, data };
};
