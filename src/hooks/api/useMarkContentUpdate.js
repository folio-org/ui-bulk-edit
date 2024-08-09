import { useMutation } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

export const useMarkContentUpdate = ({ id }) => {
  const ky = useOkapiKy();

  const { data, mutateAsync: markContentUpdate, isLoading } = useMutation({
    mutationFn: (json) => {
      return ky.post(`bulk-operations/${id}/marc-content-update`, {
        json,
      });
    },
  });

  return { markContentUpdate, isLoading, data };
};
