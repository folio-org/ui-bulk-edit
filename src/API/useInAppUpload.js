import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import { CAPABILITIES_PARAMS } from '../constants';

export const useInAppUpload = () => {
  const ky = useOkapiKy();

  const contentUpdatesTemp = [
    {
      'option': 'TEMPORARY_LOCATION',
      'action': 'CLEAR_FIELD',
    },
    {
      'option': 'PERMANENT_LOCATION',
      'action': 'REPLACE_WITH',
      'value': 'Online',
    },
  ];

  const { mutateAsync: inAppUpload, isLoading } = useMutation(({ jobId, contentUpdates = contentUpdatesTemp }) => ky.post(`bulk-edit/${jobId}/items-content-update/upload`, {
    entityType: CAPABILITIES_PARAMS.ITEM,
    contentUpdates,
    totalRecords: contentUpdates.length,
  }).json());

  return {
    inAppUpload,
    isLoading,
  };
};
