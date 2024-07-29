import { useQuery } from 'react-query';
import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { makeQueryBuilder } from '@folio/stripes-acq-components';
import noop from 'lodash/noop';
import { PAGINATION_CONFIG as pagination } from '../../constants';

export const BULK_OPERATION_USERS_KEY = 'BULK_OPERATION_USERS_KEY';

const buildLogsQuery = makeQueryBuilder(
  'cql.allRecords=1',
  noop,
  'sortby endTime/sort.descending',
);

export const useBulkOperationUsers = (filters, options) => {
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: BULK_OPERATION_USERS_KEY });

  const logsQuery = buildLogsQuery(filters);

  const searchParams = {
    query: logsQuery,
    limit: pagination.limit,
    offset: pagination.offset,
  };

  const { data, isLoading } = useQuery({
    queryKey: [namespaceKey, filters],
    queryFn: () => ky.get('bulk-operations/list-users', { searchParams }).json(),
    ...options,
  });

  return {
    data,
    isLoading,
  };
};
