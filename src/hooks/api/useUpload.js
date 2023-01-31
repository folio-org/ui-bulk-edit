import { useOkapiKy } from '@folio/stripes/core';
import { useMutation } from 'react-query';

export const useUpload = () => {
  const ky = useOkapiKy();

  const { mutateAsync: fileUpload, isLoading } = useMutation({ mutationFn: ({
    fileToUpload,
    operationId,
    entityType,
    identifierType,
    manual = false,
  }) => {
    const formData = new FormData();

    formData.append('file', fileToUpload);

    const searchParams = new URLSearchParams({
      entityType,
      identifierType,
      manual,
      ...(operationId ? { operationId } : {}),
    }).toString();

    return ky.post(`bulk-operations/upload?${searchParams}`, {
      body: formData,
    }).json();
  },
  retry: 10,
  retryDelay: 2000 });

  return {
    fileUpload,
    isLoading,
  };
};
