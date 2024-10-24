import { useNamespace } from '@folio/stripes/core';
import { useQuery } from 'react-query';
import { usePublishCoordinator } from '../usePublishCoordinator';
import { useErrorMessages } from '../useErrorMessages';

const DEFAULT_DATA = {};

export const useEscCommon = (key, url, tenants, mapResponse, options = {}) => {
  const [namespace] = useNamespace({ key });
  const { initPublicationRequest } = usePublishCoordinator(namespace);
  const { showErrorMessage } = useErrorMessages();

  const { data = DEFAULT_DATA, isFetching } = useQuery({
    queryKey: [namespace, tenants],
    queryFn: async () => {
      const { publicationResults } = await initPublicationRequest({
        url,
        method: 'GET',
        tenants,
      });
      return publicationResults;
    },
    keepPreviousData: true,
    cacheTime: Infinity,
    staleTime: Infinity,
    onError: showErrorMessage,
    onSuccess: showErrorMessage,
    ...options
  });

  const formattedData = () => {
    if (!data?.length || isFetching) return [];
    return data.flatMap(tenantData => {
      const tenantName = tenantData.tenantId;
      return mapResponse(tenantData, tenantName);
    });
  };

  const escData = formattedData().map((item) => ({
    value: item.id,
    label: item.name,
    tenant: item.tenantName
  }));

  return {
    escData,
    isFetching
  };
};
