import {
  useMutation,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

export const useFileUploadComand = (options) => {
  const ky = useOkapiKy();

  const { isLoading, mutateAsync } = useMutation({
    mutationFn: () => {
      const json = {
        type: 'CIRCULATION_LOG',
        exportTypeSpecificParameters: options.recordIdentifier,
      };

      return ky.post('data-export-spring/jobs', { json });
    },
    ...options,
  });

  const { data } = useMutation({
    mutationFn: () => {
      const json = {
        type: 'CIRCULATION_LOG',
        exportTypeSpecificParameters: options.recordIdentifier,
      };

      return ky.post('data-export-spring/jobs', { json });
    },
    ...options,
  });

  return {
    isLoading,
    requestJobId: data,
  };
};

