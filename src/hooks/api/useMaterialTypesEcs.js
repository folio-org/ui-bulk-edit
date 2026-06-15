import { useEcsCommon } from './useEcsCommon';

const MATERIAL_TYPES_PARAMS = {
  KEY: 'material-types',
  URL: 'material-types?limit=1000',
};

export const useMaterialTypesEcs = (tenants, options = {}) => {
  return useEcsCommon(
    MATERIAL_TYPES_PARAMS.KEY,
    MATERIAL_TYPES_PARAMS.URL,
    tenants,
    (tenantData, tenantName) => tenantData.response?.mtypes?.map(type => ({
      ...type,
      name: `${type.name} (${tenantName})`,
      tenantName,
    })),
    options
  );
};

