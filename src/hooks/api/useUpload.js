import { useOkapiKy } from '@folio/stripes/core';
import { useMutation } from 'react-query';

export const useUpload = () => {
  const ky = useOkapiKy();

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
    retry: (_, error) => {
      if (error.name === 'AbortError') return false;

      return 10;
    },
    retryDelay: 2000,
  });

  return {
    fileUpload,
    isLoading,
  };
};
