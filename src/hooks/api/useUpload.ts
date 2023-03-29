import { useOkapiKy } from '@folio/stripes/core';
import { useMutation } from 'react-query';
import { BulkOperationDto, EntityType } from './types';

export const useUpload = () => {
  const ky = useOkapiKy();

  const { mutateAsync: fileUpload, isLoading } = useMutation({ mutationFn: ({
    fileToUpload,
    operationId,
    entityType,
    identifierType,
    manual = false,
  } : {
    fileToUpload: any,
    operationId: string,
    entityType: EntityType,
    identifierType: string,
    manual: boolean,
  }) => {
    const formData = new FormData();

    formData.append('file', fileToUpload);

    const manualString = String(manual);

    const searchParams = new URLSearchParams({
      entityType,
      identifierType,
      manualString,
      ...(operationId ? { operationId } : {}),
    }).toString();

    return ky.post(`bulk-operations/upload?${searchParams}`, {
      body: formData,
      timeout: false,
    }).json<BulkOperationDto>();
  },
  retry: 10,
  retryDelay: 2000 });

  return {
    fileUpload,
    isLoading,
  };
};
