import { useState, useCallback } from 'react';

export const usePagination = ({ limit, offset }) => {
  const [pagination, setPagination] = useState({ offset, limit });

  const changePage = useCallback((newPagination) => {
    setPagination((p) => ({ ...p, ...newPagination }));
  }, []);

  return {
    pagination,
    changePage,
  };
};
