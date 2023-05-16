import useSorting from '@folio/stripes-acq-components/lib/AcqList/hooks/useSorting';
import { useCallback, useEffect } from 'react';
import { buildSearch, buildSortingObj } from '@folio/stripes-acq-components/lib/AcqList/utils';

export const useLocationSorting = (location, history, resetData, sortableFields, defaultSorting) => {
  const [
    sortingField,
    sortingDirection,
    changeSorting,
    setSortingField,
    setSortingDirection,
  ] = useSorting(resetData, sortableFields);

  useEffect(
    () => {
      const initialSorting = buildSortingObj(location.search, defaultSorting);

      setSortingField(initialSorting.sortingField);
      setSortingDirection(initialSorting.sortingDirection);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [resetData, location.search],
  );

  const changeLocationSorting = useCallback(
    (e, meta) => {
      const newSotring = changeSorting(e, meta);

      history.push({
        pathname: '',
        search: `${buildSearch(newSotring, location.search)}`,
      });
    },
    [changeSorting, location, history],
  );

  return [
    sortingField,
    sortingDirection,
    changeLocationSorting,
  ];
};

