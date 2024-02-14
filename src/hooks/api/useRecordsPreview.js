import { useContext, useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { useIntl } from 'react-intl';

import { useOkapiKy } from '@folio/stripes/core';

import { BULK_VISIBLE_COLUMNS } from '../../constants';
import { getMappedTableData } from '../../utils/mappers';
import { RootContext } from '../../context/RootContext';

export const RECORDS_PREVIEW_KEY = 'records';
export const IN_APP_PREVIEW_KEY = 'in-app-records';

export const useRecordsPreview = ({
  key,
  id,
  step,
  queryOptions,
  capabilities,
  limit,
  offset,
  criteria,
  queryRecordType
}) => {
  const intl = useIntl();
  const { setVisibleColumns } = useContext(RootContext);
  const ky = useOkapiKy();

  const { data, refetch, isLoading, dataUpdatedAt, isFetching } = useQuery(
    {
      queryKey: [key, id, step, limit, offset],
      cacheTime: 0,
      keepPreviousData: true,
      queryFn: () => {
        return ky.get(`bulk-operations/${id}/preview`, { searchParams: { limit, offset, step } }).json();
      },
      ...queryOptions,
    },
  );

  const { contentData, columnMapping, columns } = useMemo(() => getMappedTableData({
    data,
    intl,
    capabilities,
    criteria,
    queryRecordType
  }), [data]);

  // set initial and visible columns
  useEffect(() => {
    if (columns.length) {
      const storageKey = `${BULK_VISIBLE_COLUMNS}_${capabilities}`;
      let storedVisibleColumns = JSON.parse(localStorage.getItem(storageKey) || null);

      if (columns.length !== storedVisibleColumns?.length) {
        storedVisibleColumns = columns;
        localStorage.setItem(storageKey, JSON.stringify(storedVisibleColumns));
      }

      // force selected columns to be visible
      const mappedVisibleColumns = storedVisibleColumns.map(column => ({
        ...column,
        selected: column.selected || columns.find(({ value }) => value === column.value)?.forceSelected,
      }));

      setVisibleColumns(mappedVisibleColumns);
    }
  }, [columns, dataUpdatedAt]);

  return {
    isLoading,
    refetch,
    isFetching,
    contentData,
    columnMapping,
    columns,
  };
};
