import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

export const useInAppUpload = () => {
  const ky = useOkapiKy();

  const { mutateAsync: inAppUpload, isLoading } = useMutation({ mutationFn: ({ jobId, contentUpdates }) => {
    return ky.post(`bulk-edit/${jobId}/item-content-update/upload`, {
      searchParams: { limit: 10 },
      json: {
        contentUpdates,
        totalRecords: contentUpdates.length,
      },
    }).json();
  } });

  return {
    inAppUpload,
    isLoading,
  };
};
