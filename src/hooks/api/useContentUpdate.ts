import { useMutation } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';
import { PREVIEW_LIMITS } from '../../constants';

export const useContentUpdate = ({ id }: { id: string }) => {
  const ky = useOkapiKy();

  const { data, mutateAsync: contentUpdate, isLoading } = useMutation({
    mutationFn: ({ contentUpdates } : { contentUpdates: object }) => {
      return ky.post(`bulk-operations/${id}/content-update`, {
        searchParams: { limit: PREVIEW_LIMITS.RECORDS },
        json: contentUpdates,
      });
    },
  });

  return { contentUpdate, isLoading, data };
};
