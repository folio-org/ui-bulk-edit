import { useNamespace } from '@folio/stripes/core';
import { useQuery } from 'react-query';
import { usePublishCoordinator } from '../usePublishCoordinator';
import { useErrorMessages } from '../useErrorMessages';

const DEFAULT_DATA = {};

export const useLocationEsc = (tenants, options = {}) => {
  const [namespace] = useNamespace({ key: 'locationsEsc' });
  const { initPublicationRequest } = usePublishCoordinator(namespace);
  const { showErrorMessage } = useErrorMessages();

  const { data = DEFAULT_DATA, isFetching } = useQuery({
    queryKey: [namespace, tenants],
    queryFn: async () => {
      const { publicationResults } = await initPublicationRequest({
        url: 'locations',
        method: 'GET',
        tenants,
      });
      return publicationResults;
    },
    keepPreviousData: true,
    onError: showErrorMessage,
    onSuccess: showErrorMessage,
    ...options
  });

  const locations = () => {
    if (!data?.length || isFetching) return [];
    return data.flatMap(tenantData => {
      const tenantName = tenantData.tenantId;
      return tenantData.response?.locations?.map(note => ({
        ...note,
        name: `${note.name} (${tenantName})`,
        tenantName,
      }));
    });
  };

  const locationsEsc = locations().map((location) => ({
    value: location.id,
    label: location.name,
    tenant: location.tenantName,
  }));

  return {
    locationsEsc,
    isFetching
  };
};
