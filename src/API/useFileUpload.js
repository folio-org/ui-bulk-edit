import {
  useMutation,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

export const useJobCommand = () => {
  const ky = useOkapiKy();

  const { mutateAsync } = useMutation({
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
    requestJobId: mutateAsync,
  };
};

export const useFileUploadComand = () => {
  const ky = useOkapiKy();

  const { mutateAsync } = useMutation({ mutationFn: ({ id, fileToUpload }) => {
    const formData = new FormData();

    formData.append('file', fileToUpload);

    return ky.post(`bulk-edit/${id}/upload`, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      body: formData,
    });
  } });

  return {
    fileUpload: mutateAsync,
  };
};




