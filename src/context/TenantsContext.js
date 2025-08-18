import { createContext, useContext } from 'react';

const TenantsContext = createContext({ tenants: [], showLocal: true });

export function TenantsProvider({ children, tenants, showLocal }) {
  return (
    <TenantsContext.Provider value={{ tenants, showLocal }}>
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
