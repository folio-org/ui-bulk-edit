import { useContext, useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';
import { BULK_VISIBLE_COLUMNS, PREVIEW_LIMITS } from '../../constants';
import { getMappedTableData } from '../../utils/mappers';
import { RootContext } from '../../context/RootContext';

export const useRecordsPreview = ({ id, step, queryOptions }) => {
  const { setVisibleColumns } = useContext(RootContext);
  const ky = useOkapiKy();

  const { data, refetch, isLoading } = useQuery(
    {
      queryKey: ['records', id, step],
      cacheTime: 0,
      queryFn: () => ky.get(`bulk-operations/${id}/preview`, { searchParams: { limit: PREVIEW_LIMITS.RECORDS, step } }).json(),
      ...queryOptions,
    },
  );

  const { contentData, columnsMapping, columns } = useMemo(() => getMappedTableData(data), [data]);

  // set initial and visible columns
  useEffect(() => {
    if (columns.length) {
      const storedVisibleColumns = localStorage.getItem(BULK_VISIBLE_COLUMNS);

      // checking for columns from localStorage first
      setVisibleColumns(storedVisibleColumns ? JSON.parse(storedVisibleColumns) : columns);
    }
  }, [columns]);

  return {
    isLoading,
    refetch,

    contentData,
    columnsMapping,
    columns,
  };
};
