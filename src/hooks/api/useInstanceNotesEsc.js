import { useQuery } from 'react-query';

import { useNamespace } from '@folio/stripes/core';

import { usePublishCoordinator } from '../usePublishCoordinator';

const DEFAULT_DATA = {};

export const useInstanceNotesEsc = (tenants) => {
  const [namespace] = useNamespace('instance-notes-esc');
  const { initPublicationRequest } = usePublishCoordinator();

  const { data = DEFAULT_DATA, isFetching } = useQuery({
    queryKey: [namespace, tenants],
    queryFn: async () => {
      const { publicationResults } = await initPublicationRequest({
        url: 'instance-note-types',
        method: 'GET',
        tenants,
      });

      console.log(publicationResults);

      return publicationResults;
    },
    endpoint: tenants,
    keepPreviousData: true,
  });

  return {
    data,
    isFetching,
  };
};
