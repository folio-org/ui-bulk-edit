import {
  useMutation,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

export const useJobCommand = () => {
  const ky = useOkapiKy();

  const { mutateAsync: requestJobId, isLoading } = useMutation({
    mutationFn: ({ recordIdentifier }) => {
      const json = {
        type: 'BULK_EDIT_IDENTIFIERS',
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
    });
  } });

  return {
    fileUpload,
  };
};




