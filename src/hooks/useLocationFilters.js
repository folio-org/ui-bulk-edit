import useFilters from '@folio/stripes-acq-components/lib/AcqList/hooks/useFilters';
import { useCallback, useEffect } from 'react';
import { buildFiltersObj } from '@folio/stripes-acq-components/lib/AcqList/utils';
import { buildSearch } from '@folio/stripes-acq-components';
import { SEARCH_INDEX_PARAMETER } from '@folio/stripes-acq-components/lib/AcqList/constants';
import { useHistory } from 'react-router-dom';

export const useLocationFilters = ({
  resetData = () => {},
  initialFilter,
}) => {
  const history = useHistory();
  const { search } = history.location;

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
      const searchParams = new URLSearchParams(search);
      const criteria = searchParams.get('criteria');
      const capabilities = searchParams.get('capabilities');
      const fileName = searchParams.get('fileName');
      const step = searchParams.get('step');

      history.replace({
        pathname: '',
        search: `${buildSearch({ ...newFilters, capabilities, criteria, fileName, step }, search)}`,
      });

      return newFilters;
    },
    [applyFilters, history, search],
  );

  const resetLocationFilters = useCallback(
    () => {
      resetFilters();

      history.push({
        pathname: '',
        search: buildSearch({
          capabilities: initialFilter.capabilities,
          criteria: initialFilter.criteria,
          step: initialFilter.step,
          fileName: initialFilter.fileName,
          recordTypes: initialFilter.recordTypes
        }),
      });
    },
    [history, resetFilters],
  );

  return [
    filters,
    applyLocationFilters,
    resetLocationFilters,
    searchIndex,
  ];
};
