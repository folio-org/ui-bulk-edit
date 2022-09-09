import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { CAPABILITIES_VALUE } from '../constants';

export const useInAppUpload = (signal) => {
  const ky = useOkapiKy();

  const { mutateAsync: inAppUpload, isLoading } = useMutation({ mutationFn: ({ jobId, contentUpdates, capability }) => {
    const typeOfBulk = CAPABILITIES_VALUE[capability];

    const getBody = () => {
      if (typeOfBulk === CAPABILITIES_VALUE.ITEMS) {
        return {
          itemContentUpdates: contentUpdates,
          totalRecords: contentUpdates.length,
        };
      } else {
        return {
          userContentUpdates: contentUpdates,
          totalRecords: contentUpdates.length,
        };
      }
    };

    return ky.post(`bulk-edit/${jobId}/${typeOfBulk}-content-update/upload`, {
      searchParams: { limit: 10 },
      json: getBody(),
      timeout: false,
      signal,
    }).json();
  } });

  return {
    inAppUpload,
    isLoading,
  };
};
