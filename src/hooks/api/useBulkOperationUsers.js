import { useQuery } from 'react-query';
import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { omit } from 'lodash';

import { makeQueryBuilder } from '@folio/stripes-acq-components';
import noop from 'lodash/noop';
import { LOGS_FILTERS, PAGINATION_CONFIG as pagination } from '../../constants';

export const BULK_OPERATION_USERS_KEY = 'BULK_OPERATION_USERS_KEY';

const buildLogsQuery = makeQueryBuilder(
  'cql.allRecords=1',
  noop,
  'sortby endTime/sort.descending',
);

export const useBulkOperationUsers = (filters, options) => {
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: BULK_OPERATION_USERS_KEY });

  const logsQuery = buildLogsQuery(omit(filters, [LOGS_FILTERS.USER]));

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
