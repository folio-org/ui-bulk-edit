import { useContext, useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { useIntl } from 'react-intl';

import { useNamespace, useOkapiKy } from '@folio/stripes/core';

import { BULK_VISIBLE_COLUMNS } from '../../constants';
import { getMappedTableData } from '../../utils/mappers';
import { RootContext } from '../../context/RootContext';
import { useErrorMessages } from '../useErrorMessages';

export const RECORDS_PREVIEW_KEY = 'RECORDS_PREVIEW_KEY';
export const PREVIEW_MODAL_KEY = 'PREVIEW_MODAL_KEY';

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
  const [namespaceKey] = useNamespace({ key });
  const { showErrorMessage } = useErrorMessages();

  const { data, refetch, isLoading, isFetching } = useQuery(
    {
      queryKey: [key, namespaceKey, id, step, limit, offset],
      keepPreviousData: true,
      queryFn: () => {
        return ky.get(`bulk-operations/${id}/preview`, { searchParams: { limit, offset, step } }).json();
      },
      onError: showErrorMessage,
      onSuccess: showErrorMessage,
      ...queryOptions,
    },
  );

  const { contentData, columnMapping, columns } = useMemo(() => getMappedTableData({
    data,
    intl,
    capabilities,
    criteria,
    queryRecordType
  }), [
    data,
    intl,
    capabilities,
    criteria,
    queryRecordType
  ]);

  const visibleColumns = useMemo(() => {
    if (!columns.length) return null;

    const storageKey = `${BULK_VISIBLE_COLUMNS}_${capabilities}`;
    let storedVisibleColumns = JSON.parse(localStorage.getItem(storageKey) || null);

    if (columns.length !== storedVisibleColumns?.length) {
      storedVisibleColumns = columns;
      localStorage.setItem(storageKey, JSON.stringify(storedVisibleColumns));
    }

    // force selected columns to be visible
    return storedVisibleColumns.map(column => ({
      ...column,
      selected: column.selected || columns.find(({ value }) => value === column.value)?.forceSelected,
    }));
  }, [columns, capabilities]);

  useEffect(() => {
    if (visibleColumns) {
      setVisibleColumns(visibleColumns);
    }
  }, [visibleColumns, setVisibleColumns]);

  return {
    isLoading,
    refetch,
    isFetching,
    contentData,
    columnMapping,
    columns,
  };
};
