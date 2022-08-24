import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { CAPABILITIES, CAPABILITIES_VALUE } from '../constants';

export const useInAppUpload = () => {
  const ky = useOkapiKy();

  const { mutateAsync: inAppUpload, isLoading } = useMutation({ mutationFn: ({ jobId, contentUpdates, capability }) => {
      const typeOfBulk = capability === CAPABILITIES.ITEM ?
          CAPABILITIES_VALUE.ITEM : CAPABILITIES_VALUE.USER;

        return ky.post(`bulk-edit/${jobId}/${typeOfBulk}-content-update/upload`, {
          searchParams: { limit: 10 },
          json: typeOfBulk === CAPABILITIES_VALUE.ITEM ?
              {
                itemContentUpdate: contentUpdates,
                totalRecords: contentUpdates.length,
              }
              :
              {
                userContentUpdate: contentUpdates,
                totalRecords: contentUpdates.length,
              },
        }).json();
  } });

  return {
    inAppUpload,
    isLoading,
  };
};
