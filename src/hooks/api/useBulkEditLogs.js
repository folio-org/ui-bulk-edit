import { useRef } from 'react';
import { useQuery } from 'react-query';
import noop from 'lodash/noop';
import uniq from 'lodash/uniq';

import {
  useOkapiKy,
  useNamespace,
} from '@folio/stripes/core';
import {
  makeQueryBuilder,
  getFiltersCount,
  batchRequest,
} from '@folio/stripes-acq-components';

const buildLogsQuery = makeQueryBuilder(
  'cql.allRecords=1',
  noop,
  'sortby startTime/sort.descending',
);

export const useBulkEditLogs = ({ filters, pagination }) => {
  const usersMap = useRef({});
  const ky = useOkapiKy();
  const [namespace] = useNamespace({ key: 'bulk-edit-logs' });

  const logsQuery = buildLogsQuery(filters);
  const filtersCount = getFiltersCount(filters);

  const searchParams = {
    query: logsQuery,
    limit: pagination.limit,
    offset: pagination.offset,
  };

  const queryKey = [namespace, pagination.timestamp, pagination.limit, pagination.offset];
  const queryFn = async () => {
    if (!filtersCount) {
      return { bulkOperations: [], totalRecords: 0 };
    }

    const { bulkOperations, totalRecords } = await ky.get('bulk-operations', { searchParams }).json();
    const userIds = uniq(bulkOperations.map(({ userId }) => userId))
      .filter(userId => userId && !usersMap.current[userId]);
    const fetchedUsers = await batchRequest(
      async ({ params }) => {
        const usersResponse = await ky.get('users', { searchParams: params }).json();

        return usersResponse.users;
      },
      userIds,
    );

    if (fetchedUsers.length) {
      usersMap.current = {
        ...usersMap.current,
        ...(
          fetchedUsers.reduce((acc, { id, personal }) => {
            acc[id] = `${personal?.firstName || ''} ${personal?.lastName || ''}`;

            return acc;
          }, {})
        ),
      };
    }

    return {
      bulkOperations: bulkOperations.map(operation => ({
        ...operation,
        runBy: usersMap.current[operation.userId],
      })),
      totalRecords,
    };
  };

  const { data, isFetching } = useQuery(
    queryKey,
    queryFn,
    {
      enabled: Boolean(pagination.timestamp),
      keepPreviousData: true,
    },
  );

  return {
    logs: data?.bulkOperations || [],
    logsCount: data?.totalRecords || 0,
    isLoading: isFetching,
  };
};
