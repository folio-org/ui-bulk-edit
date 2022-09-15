import {
  useQuery,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

export const useInAppDownloadPreview = (id, capability) => {
  const capabilityMapping = {
    users: 'users',
    items: 'items',
    holdings_record: 'holdings',
  };
  const ky = useOkapiKy();
  const { data, refetch, isLoading } = useQuery(
    {
      queryKey: ['InAppDownloadPreview', id],
      queryFn: () => ky.get(`bulk-edit/${id}/preview/updated-${capabilityMapping[capability]}/download`),
      enabled: false,
    },
  );

  return { data, refetch, isLoading };
};
