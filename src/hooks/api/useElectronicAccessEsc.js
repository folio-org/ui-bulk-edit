import { useEcsCommon } from './useEcsCommon';

const ELECTRONIC_PARAMS = {
  KEY: 'electronicAccessEsc',
  URL: 'electronic-access-relationships?limit=1000&query=cql.allRecords=1 sortby name'
};

export const useElectronicAccessEsc = (tenants, options = {}) => {
  return useEcsCommon(
    ELECTRONIC_PARAMS.KEY,
    ELECTRONIC_PARAMS.URL,
    tenants,
    (tenantData, tenantName) => tenantData.response?.electronicAccessRelationships?.map(type => ({
      ...type,
      name: `${type.name} (${tenantName})`,
      tenantName,
    })),
    options
  );
};
