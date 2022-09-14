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

  const getMappedHoldings = async (holdingsRecords) => {
    const { locations } = await ky.get('locations', { searchParams: { limit: 3000 } }).json();
    const { holdingsRecordsSources } = await ky.get('holdings-sources', { searchParams: { limit: 3000 } }).json();
    const { holdingsTypes } = await ky.get('holdings-types', { searchParams: { limit: 3000 } }).json();
    const { callNumberTypes } = await ky.get('call-number-types', { searchParams: { limit: 3000 } }).json();

    const getLocationName = (locationId) => locations.find(location => location.id === locationId)?.name;
    const getSourceName = (sourceId) => holdingsRecordsSources.find(source => source.id === sourceId)?.name;
    const getHoldingTypeName = (typeId) => holdingsTypes.find(type => type.id === typeId)?.name;
    const getCallNumberTypeName = (typeId) => callNumberTypes.find(type => type.id === typeId)?.name;

    return holdingsRecords.map(holding => ({
      ...holding,
      temporaryLocation: getLocationName(holding.temporaryLocationId),
      permanentLocation: getLocationName(holding.permanentLocationId),
      effectiveLocation: getLocationName(holding.effectiveLocationId),
      source: getSourceName(holding.sourceId),
      holdingsType: getHoldingTypeName(holding.holdingsTypeId),
      callNumberType: getCallNumberTypeName(holding.callNumberTypeId),
    }));
  };

  const { data } = useQuery(
    {
      queryKey: ['previewRecords', id],
      queryFn: async () => {
        const { users, items, totalRecords, holdingsRecords } = await ky.get(`bulk-edit/${id}/preview/${urlMapping[capabilities]}`, { searchParams: { limit: 10 } }).json();
        let holdings;

        if (holdingsRecords) {
          holdings = await getMappedHoldings(holdingsRecords);
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
