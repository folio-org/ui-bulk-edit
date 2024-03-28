import { useCallback, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import useFilters from '@folio/stripes-acq-components/lib/AcqList/hooks/useFilters';
import { buildFiltersObj } from '@folio/stripes-acq-components/lib/AcqList/utils';
import { buildSearch } from '@folio/stripes-acq-components';
import { SEARCH_INDEX_PARAMETER } from '@folio/stripes-acq-components/lib/AcqList/constants';

import { useSearchParams } from './useSearchParams';

export const useLocationFilters = ({
  resetData = () => {},
  initialFilter,
}) => {
  const history = useHistory();
  const { search } = history.location;
  const {
    step,
    criteria,
    initialFileName,
    currentRecordType,
  } = useSearchParams();

  const {
    filters,
    applyFilters,
    resetFilters,
    setFilters,
    setSearchIndex,
    searchIndex,
  } = useFilters(resetData, initialFilter);

  useEffect(
    () => {
      const initialFilters = buildFiltersObj(search);

      setFilters(initialFilters);
      setSearchIndex(initialFilters[SEARCH_INDEX_PARAMETER] || '');
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [search],
  );

  const applyLocationFilters = useCallback(
    (type, value) => {
      const newFilters = applyFilters(type, value);

      history.replace({
        pathname: '',
        search: `${buildSearch({
          ...newFilters,
          capabilities: currentRecordType,
          fileName: initialFileName,
          criteria,
          step
        }, search)}`,
      });

      return newFilters;
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [applyFilters, history, search],
  );

  const resetLocationFilters = useCallback(
    () => {
      resetFilters();

      history.push({
        pathname: '',
        search: buildSearch(initialFilter),
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [history, resetFilters],
  );

  return [
    filters,
    applyLocationFilters,
    resetLocationFilters,
    searchIndex,
  ];
};
