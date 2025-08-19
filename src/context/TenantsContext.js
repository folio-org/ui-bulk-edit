import { createContext, useCallback, useContext, useMemo } from 'react';
import PropTypes from 'prop-types';

const TenantsContext = createContext({ tenants: [] });

export function TenantsProvider({ children, tenants, showLocal }) {
  const excludeLocalResults = useCallback((records) => {
    if (showLocal) return records;

    return records.filter(({ source }) => source !== 'local');
  }, [showLocal]);

  const value = useMemo(() => ({
    tenants,
    excludeLocalResults,
  }), [tenants, excludeLocalResults]);

  return (
    <TenantsContext.Provider value={value}>
      {children}
    </TenantsContext.Provider>
  );
}

export function useTenants() {
  const context = useContext(TenantsContext);
  if (!context) {
    throw new Error('useTenants must be used within a TenantsProvider');
  }
  return context;
}

TenantsProvider.propTypes = {
  children: PropTypes.node.isRequired,
  tenants: PropTypes.arrayOf(PropTypes.string).isRequired,
  showLocal: PropTypes.bool,
};
