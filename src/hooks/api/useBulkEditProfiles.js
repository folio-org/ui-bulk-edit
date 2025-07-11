import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import {
  CQLBuilder,
  fetchAllRecords,
} from '@folio/stripes-acq-components';

import {
  BULK_EDIT_PROFILES_API,
  CAPABILITIES,
} from '../../constants';

const NAMESPACE_KEY = 'bulk-edit-profiles';
const DEFAULT_DATA = [];

const ENTITY_TYPE_DICT = {
  [CAPABILITIES.INSTANCE]: [CAPABILITIES.INSTANCE, CAPABILITIES.INSTANCE_MARC],
};

const groupByEntityType = (entityType) => (builder) => {
  const entityTypes = ENTITY_TYPE_DICT[entityType] || [entityType];

  entityTypes.reduce((acc, curr) => {
    return acc.or().equal('entityType', curr);
  }, builder);
};

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
        .group(groupByEntityType(entityType))
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
      queryKey: [namespace, entityType, tenantId],
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
