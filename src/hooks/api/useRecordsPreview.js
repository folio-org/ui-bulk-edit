import { useContext, useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { useIntl } from 'react-intl';

import { useNamespace, useOkapiKy } from '@folio/stripes/core';

import noop from 'lodash/noop';
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
  queryRecordType,
  onSuccess = noop,
}) => {
  const intl = useIntl();
  const { setVisibleColumns } = useContext(RootContext);
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key });
  const { showErrorMessage } = useErrorMessages();

  const { data, refetch, isLoading, dataUpdatedAt, isFetching } = useQuery(
    {
      queryKey: [key, namespaceKey, id, step, limit, offset],
      cacheTime: 0,
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
  }, [
    columns,
    dataUpdatedAt,
    setVisibleColumns,
    capabilities
  ]);

  console.log(contentData);
  useEffect(() => {
    if (contentData?.length > 0) {
      onSuccess();
    }
  }, [contentData, onSuccess]);

  return {
    isLoading,
    refetch,
    isFetching,
    contentData,
    columnMapping,
    columns,
  };
};
