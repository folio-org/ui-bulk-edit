import {
  useMutation,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import { CAPABILITIES } from '../constants';

export const useJobCommand = ({ entityType }) => {
  const ky = useOkapiKy();

  const { mutateAsync: requestJobId, isLoading } = useMutation({
    mutationFn: ({ recordIdentifier, editType, specificParameters }) => {
      const entityTypeMap = {
        [CAPABILITIES.ITEM]: 'ITEM',
        [CAPABILITIES.USER]: 'USER',
        [CAPABILITIES.HOLDINGS]: 'HOLDINGS_RECORD',
      };

      const json = {
        type: editType,
        entityType: entityTypeMap[entityType],
        exportTypeSpecificParameters: specificParameters || {},
        ...(
          recordIdentifier && { identifierType: recordIdentifier }
        ),
      };

      return ky.post('data-export-spring/jobs', { json }).json();
    },
  });

  return {
    requestJobId,
    isLoading,
  };
};

export const useFileUploadComand = () => {
  const ky = useOkapiKy();

  const { mutateAsync: fileUpload, isLoading } = useMutation(
    {
      mutationFn: ({ id, fileToUpload, controller }) => {
        const formData = new FormData();

        formData.append('file', fileToUpload);

        return ky.post(`bulk-edit/${id}/upload`, {
          body: formData,
          timeout: false,
          signal: controller?.signal,
        }).json();
      },
      retry: 30,
      retryDelay: 2000,
    },
  );

  return {
    fileUpload,
    isLoading,
  };
};

export const useLaunchJob = () => {
  const ky = useOkapiKy();

  const { mutateAsync: startJob } = useMutation({ mutationFn: ({ jobId }) => {
    return ky.post(`bulk-edit/${jobId}/start`);
  } });

  return {
    startJob,
  };
};

export const useRollBack = () => {
  const ky = useOkapiKy();

  const { mutateAsync: rollBackJob } = useMutation({ mutationFn: ({ id }) => {
    return ky.post(`bulk-edit/${id}/roll-back`);
  } });

  return {
    rollBackJob,
  };
};


