import React, { createContext, useContext, useMemo } from 'react';

const MetadataContext = createContext(null);

export function MetadataProvider({ value, children }) {
  const stable = useMemo(() => value ?? {}, [value]);

  return (
    <MetadataContext.Provider value={stable}>
      {children}
    </MetadataContext.Provider>
  );
}

export function useMetadata() {
  const ctx = useContext(MetadataContext);

  if (ctx === null) {
    throw new Error('useMetadata must be used within <MetadataProvider>');
  }
  return ctx;
}
