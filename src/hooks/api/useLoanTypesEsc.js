import {useEscCommon} from "./useEscCommon";

const LOAN_TYPES_PARAMS = {
    KEY: 'loan-types',
    URL: 'loan-types?limit=1000',
}

export const useLoanTypesEsc = (tenants, options = {}) => {
    return useEscCommon(
        LOAN_TYPES_PARAMS.KEY,
        LOAN_TYPES_PARAMS.URL,
        tenants,
        (tenantData, tenantName) => tenantData.response?.loantypes?.map(type => ({
            ...type,
            name: `${type.name} (${tenantName})`,
        })),
        options
    );
};
