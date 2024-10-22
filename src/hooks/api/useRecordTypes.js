import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';
import { useErrorMessages } from '../useErrorMessages';

export const ENTITY_TYPE_KEY = 'ENTITY_TYPE_KEY';

export const useRecordTypes = ({ enabled } = {}) => {
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: ENTITY_TYPE_KEY });
  const { showErrorMessage } = useErrorMessages();

  const { data, isLoading, error } = useQuery({
    queryKey: [namespaceKey],
    queryFn: async () => {
      const response = await ky.get('entity-types');

      return (await response.json()).entityTypes;
    },
    cacheTime: Infinity,
    staleTime: Infinity,
    onError: showErrorMessage,
    onSuccess: showErrorMessage,
    enabled
  });

  return ({
    recordTypes: data,
    isLoading,
    error
  });
};
