import React from 'react';

type RootContextType = {
  setNewBulkFooterShown: () => void;
  countOfRecords: number,
  setCountOfRecords: () => void,
  visibleColumns: [],
  setVisibleColumns: React.Dispatch<React.SetStateAction<null>>,
  confirmedFileName: string,
};

export const RootContext = React.createContext(null!);
