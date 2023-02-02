import { useQuery } from 'react-query';
import queryString from 'query-string';
import noop from 'lodash/noop';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';
import {
  makeQueryBuilder,
  getFiltersCount,
  SORTING_PARAMETER,
  SORTING_DIRECTION_PARAMETER,
} from '@folio/stripes-acq-components';

import { FILTERS } from '../../constants';

const queryFields = [SORTING_PARAMETER, SORTING_DIRECTION_PARAMETER, ...Object.values(FILTERS)];

const parseLogsSearch = (search) => {
  const queryParams = queryString.parse(search);

  return Object.keys(queryParams).reduce((acc, key) => {
    if (queryFields.some(field => field === key)) {
      acc[key] = queryParams[key];
    }

    return acc;
  }, {});
};

const buildLogsQuery = makeQueryBuilder(
  'cql.allRecords=1',
  noop,
  'sortby startTime/sort.descending',
);

export const useBulkEditLogs = ({ search, pagination }) => {
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'bulk-edit-logs' });

  const queryParams = parseLogsSearch(search);
  const logsQuery = buildLogsQuery(queryParams);
  const filtersCount = getFiltersCount(queryParams);

  const searchParams = {
    query: logsQuery,
    limit: pagination.limit,
    offset: pagination.offset,
  };

  const queryKey = [namespace, pagination.timestamp, pagination.limit, pagination.offset];
  const queryFn = () => {
    if (!filtersCount) {
      return { bulkOperations: [], totalRecords: 0 };
    }

    return ky.get('bulk-operations', { searchParams }).json()
      .then(async response => {
        const { bulkOperations = [], totalRecords } = response;
        let userNamesMap = {};

        for (const item of bulkOperations) {
          if (item.userId) {
            const user = await ky.get(`users/${item.userId}`).json();

            userNamesMap = { ...userNamesMap, [item.userId]: `${user.personal?.firstName} ${user.personal?.lastName}` };
          }
        }

        return {
          bulkOperations,
          userNamesMap,
          totalRecords,
        };
      });
  };

  const { data, isLoading } = useQuery(
    queryKey,
    queryFn,
    {
      enabled: Boolean(pagination.timestamp),
      keepPreviousData: true,
    },
  );

  return {
    userNamesMap: data?.userNamesMap || {},
    logs: data?.bulkOperations || [],
    logsCount: data?.totalRecords || 0,
    isLoading,
  };
};
