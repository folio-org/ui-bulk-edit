import { useEcsCommon } from './useEcsCommon';

const LOAN_TYPES_PARAMS = {
  KEY: 'loan-types',
  URL: 'loan-types?limit=1000',
};

export const useLoanTypesEcs = (tenants, options = {}) => {
  return useEcsCommon(
    LOAN_TYPES_PARAMS.KEY,
    LOAN_TYPES_PARAMS.URL,
    tenants,
    (tenantData, tenantName) => tenantData.response?.loantypes?.map(type => ({
      ...type,
      name: `${type.name} (${tenantName})`,
      tenantName,
    })),
    options
  );
};
