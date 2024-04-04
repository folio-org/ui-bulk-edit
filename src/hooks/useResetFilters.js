import { useEffect, useState } from 'react';
import { useHistory } from 'react-router';
import { IDENTIFIER_FILTERS, LOGS_FILTERS, QUERY_FILTERS } from '../constants';

export const useResetFilters = () => {
  const history = useHistory();

  const [filtersTab, setFiltersTab] = useState({
    identifierTab: [],
    queryTab: [],
    logsTab: [],
  });

  useEffect(() => {
    const search = new URLSearchParams(history.location.search);

    const identifierFilters = Object.values(IDENTIFIER_FILTERS).map((el) => search.getAll(el));
    const queryFilters = Object.values(QUERY_FILTERS).map((el) => search.getAll(el));
    const logsFilters = Object.values(LOGS_FILTERS).map((el) => search.getAll(el));

    setFiltersTab(prevState => ({
      ...prevState,
      queryTab: queryFilters,
      identifierTab: identifierFilters,
      logsTab: logsFilters,
    }));
  }, [history.location.search]);

  return { filtersTab };
};
