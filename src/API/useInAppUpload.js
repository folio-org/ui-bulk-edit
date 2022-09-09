import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import { CAPABILITIES_PARAMS } from '../constants';

export const useInAppUpload = (signal) => {
  const ky = useOkapiKy();

  const { mutateAsync: inAppUpload, isLoading } = useMutation({ mutationFn: ({ jobId, contentUpdates }) => {
    return ky.post(`bulk-edit/${jobId}/items-content-update/upload`, {
      searchParams: { limit: 10 },
      json: {
        entityType: CAPABILITIES_PARAMS.ITEM,
        contentUpdates,
        totalRecords: contentUpdates.length,
      },
      timeout: false,
      signal,
    }).json();
  } });

  return {
    inAppUpload,
    isLoading,
  };
};
