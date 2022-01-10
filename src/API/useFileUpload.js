import {
  useMutation,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

export const useJobCommand = () => {
  const ky = useOkapiKy();

  const { mutateAsync: requestJobId, isLoading } = useMutation({
    mutationFn: ({ recordIdentifier, editType }) => {
      const json = {
        type: editType,
        identifierType: recordIdentifier,
        entityType: 'USER',
        exportTypeSpecificParameters: {},
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

  const { mutateAsync: fileUpload } = useMutation({ mutationFn: ({ id, fileToUpload }) => {
    const formData = new FormData();

    formData.append('file', fileToUpload);

    return ky.post(`bulk-edit/${id}/upload`, {
      body: formData,
    }).json();
  } });

  return {
    fileUpload,
  };
};

export const useLaunchJob = () => {
  const ky = useOkapiKy();

  const { mutateAsync: startJob } = useMutation({ mutationFn: ({ id }) => {
    return ky.post(`bulk-edit/${id}/start`);
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


