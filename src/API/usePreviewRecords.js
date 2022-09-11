import {
  useQuery,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

export const usePreviewRecords = (id, capabilities, options = {}) => {
  const ky = useOkapiKy();
  const urlMapping = {
    users: 'users',
    items: 'items',
    holdings_record: 'holdings',
  };

  const { data } = useQuery(
    {
      queryKey: ['previewRecords', id],
      queryFn: async () => {
        const { users, items, totalRecords, holdingsRecords } = await ky.get(`bulk-edit/${id}/preview/${urlMapping[capabilities]}`, { searchParams: { limit: 10 } }).json();
        let holdings;

        if (holdingsRecords) {
          const { locations } = await ky.get('locations', { searchParams: { limit: 3000 } }).json();
          const getLocationName = (locationId) => locations.find(location => location.id === locationId)?.name;

          holdings = holdingsRecords.map(holding => ({
            ...holding,
            temporaryLocation: getLocationName(holding.temporaryLocationId),
            permanentLocation: getLocationName(holding.permanentLocationId),
            effectiveLocation: getLocationName(holding.effectiveLocationId),
          }));
        }

        return {
          users,
          items,
          totalRecords,
          holdings,
        };
      },
      enabled: !!id,
      ...options,
    },
  );

  return ({
    items: data?.users || data?.items || data?.holdings,
    totalRecords: data?.totalRecords,
  });
};
