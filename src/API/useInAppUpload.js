import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import { CAPABILITIES_PARAMS } from '../constants';

export const useInAppUpload = ({ id }) => {
  const ky = useOkapiKy();

  const { mutateAsync: inAppUpload, isLoading } = useMutation({
    mutationFn: () => ky.post(`bulk-edit/${id}/items-content-update/upload`, {
      entityType: CAPABILITIES_PARAMS.ITEM,
    }).json(),
  });

  return {
    inAppUpload,
    isLoading,
  };
};
