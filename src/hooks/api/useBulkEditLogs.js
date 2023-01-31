import { useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';
import queryString from 'query-string';
import { FILTERS } from '../../constants';
import { buildFilterQuery, buildArrayFieldQuery, buildDateRangeQuery } from '../../utils/queryUtils';


export const useBulkEditLogs = ({ location }) => {
  const ky = useOkapiKy();

  const queryParams = queryString.parse(location.search);

  delete queryParams.capabilities;
  delete queryParams.criteria;

  const queryParamsFilterQuery = buildFilterQuery(
    queryParams,
    null,
    {
      [FILTERS.STATUS]: buildArrayFieldQuery.bind(null, [FILTERS.STATUS]),
      [FILTERS.CAPABILITY]: buildArrayFieldQuery.bind(null, [FILTERS.CAPABILITY]),
      [FILTERS.OPERATION_TYPE]: buildArrayFieldQuery.bind(null, FILTERS.OPERATION_TYPE),
      [FILTERS.START_DATE]: buildDateRangeQuery.bind(null, FILTERS.START_DATE),
      [FILTERS.END_DATE]: buildDateRangeQuery.bind(null, FILTERS.END_DATE),
    },
  );
  const filterQuery = queryParamsFilterQuery || 'cql.allRecords=1';

  const { data, isLoading } = useQuery(
    {
      queryKey: ['bulkEditLogs', location.search],
      queryFn: () => ky.get('bulk-operations', { searchParams: { query: filterQuery } }).json()
        .then(async response => {
          let userNamesMap = {};

          for (const item of response.bulkOperations) {
            if (item.userId) {
              const user = await ky.get(`users/${item.userId}`).json();

              userNamesMap = { ...userNamesMap, [item.userId]: `${user.personal?.firstName} ${user.personal?.lastName}` };
            }
          }

          return {
            bulkOperations: response.bulkOperations,
            userNamesMap,
          };
        }),
      enabled: !!Object.keys(queryParams).length,
      retry: false,
    },
  );

  return {
    logs: data?.bulkOperations || [],
    userNamesMap: data?.userNamesMap || {},
    isLoading,
  };
};
