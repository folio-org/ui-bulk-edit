import PropTypes from 'prop-types';
import { createContext, useContext, useMemo } from 'react';

const TenantsContext = createContext({ tenants: [], showLocal: true });

export function TenantsProvider({ children, tenants, showLocal }) {
  const value = useMemo(() => ({
    tenants,
    showLocal,
  }), [tenants, showLocal]);

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
