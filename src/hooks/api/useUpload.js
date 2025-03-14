import { useMutation } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { useErrorMessages } from '../useErrorMessages';


export const useUpload = () => {
  const ky = useOkapiKy();
  const { showErrorMessage } = useErrorMessages();

  const { mutateAsync: fileUpload, isLoading } = useMutation({
    mutationFn: ({
      manual = false,
      fileToUpload,
      operationId,
      entityType,
      identifierType,
      signal,
    }) => {
      const formData = new FormData();

      formData.append('file', fileToUpload);

      const searchParams = new URLSearchParams({
        entityType,
        identifierType,
        manual: String(manual),
        ...(operationId ? { operationId } : {}),
      }).toString();

      return ky.post(`bulk-operations/upload?${searchParams}`, {
        body: formData,
        timeout: false,
        ...(signal ? { signal } : {}),
      }).json();
    },
    onSuccess: showErrorMessage,
    onError: showErrorMessage,
    retry: 0,
  });

  return {
    fileUpload,
    isLoading,
  };
};
