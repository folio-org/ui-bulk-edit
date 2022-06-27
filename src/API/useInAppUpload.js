import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import { CAPABILITIES_PARAMS } from '../constants';

export const useInAppUpload = () => {
  const ky = useOkapiKy();

  const { mutateAsync: inAppUpload, isLoading } = useMutation({ mutationFn: ({ jobId, contentUpdates }) => {
    return ky.post(`bulk-edit/${jobId}/items-content-update/upload`, {
      searchParams: { limit: 10 },
      json: {
        entityType: CAPABILITIES_PARAMS.ITEM,
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
