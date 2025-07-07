import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  CQLBuilder,
  fetchAllRecords,
} from '@folio/stripes-acq-components';

import { BULK_EDIT_PROFILES_API } from '../../constants';

const NAMESPACE_KEY = 'bulk-edit-profiles';
const DEFAULT_DATA = [];

export const useBulkEditProfiles = (params = {}, options = {}) => {
  const { entityType } = params;
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: NAMESPACE_KEY });

  const cqlBuilder = new CQLBuilder();
  const searchQuery = entityType
    ? (
      cqlBuilder
        .equal('entityType', entityType)
        .sortBy('name', 'asc')
        .build()
    )
    : (
      cqlBuilder
        .allRecords()
        .sortBy('name', 'asc')
        .build()
    );

  const {
    data,
    isFetching,
    isLoading,
  } = useQuery(
    {
      queryKey: [namespace],
      queryFn: ({ signal }) => fetchAllRecords(
        {
          GET: ({ params: searchParams }) => (
            ky.get(BULK_EDIT_PROFILES_API, { searchParams, signal })
              .json()
              .then(({ content }) => content)
          ),
        },
        searchQuery,
      ),
      enabled,
      ...queryOptions,
    },
  );

  return {
    isFetching,
    isLoading,
    profiles: data ?? DEFAULT_DATA,
  };
};
