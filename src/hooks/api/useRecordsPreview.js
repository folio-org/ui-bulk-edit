import { useContext, useEffect, useMemo } from 'react';
import { useQuery } from 'react-query';
import { useIntl } from 'react-intl';

import { useOkapiKy } from '@folio/stripes/core';

import {
  BULK_VISIBLE_COLUMNS,
  EDITING_STEPS,
  PREVIEW_LIMITS,
} from '../../constants';
import { getMappedTableData } from '../../utils/mappers';
import { RootContext } from '../../context/RootContext';

export const useRecordsPreview = ({ id, step, queryOptions, capabilities }) => {
  const intl = useIntl();
  const { setVisibleColumns } = useContext(RootContext);
  const ky = useOkapiKy();

  const { data, refetch, isLoading } = useQuery(
    {
      queryKey: ['records', id, step],
      cacheTime: 0,
      queryFn: () => {
        return ky.get(`bulk-operations/${id}/preview`, { searchParams: { limit: PREVIEW_LIMITS.RECORDS, step } }).json();
      },
      ...queryOptions,
    },
  );

  const { contentData, columnMapping, columns } = useMemo(() => getMappedTableData({
    data,
    intl,
    capabilities,
  }), [data]);

  // set initial and visible columns
  useEffect(() => {
    if (columns.length) {
      const storedVisibleColumns = step === EDITING_STEPS.UPLOAD
        ? JSON.stringify(columns)
        : localStorage.getItem(BULK_VISIBLE_COLUMNS);

      localStorage.setItem(BULK_VISIBLE_COLUMNS, storedVisibleColumns);

      setVisibleColumns(JSON.parse(storedVisibleColumns));
    }
  }, [columns]);

  return {
    isLoading,
    refetch,

    contentData,
    columnMapping,
    columns,
  };
};
