import { useMutation } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';

export const useContentUpdate = ({ id, limit, offset }) => {
  const ky = useOkapiKy();

  const { data, mutateAsync: contentUpdate, isLoading } = useMutation({
    mutationFn: ({ contentUpdates }) => {
      return ky.post(`bulk-operations/${id}/content-update`, {
        searchParams: { limit, offset },
        json: contentUpdates,
      });
    },
  });

  return { contentUpdate, isLoading, data };
};
