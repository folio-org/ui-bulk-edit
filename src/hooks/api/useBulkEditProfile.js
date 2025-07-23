import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { CQLBuilder } from '@folio/stripes-acq-components';

import { BULK_EDIT_PROFILES_API } from '../../constants';

const NAMESPACE_KEY = 'bulk-edit-profile-details';

export const useBulkEditProfile = (profileId, options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: NAMESPACE_KEY });

  const cqlBuilder = new CQLBuilder();

  const searchParams = {
    query: cqlBuilder.equal('id', profileId).build(),
  };

  const {
    data,
    isFetching,
    isLoading,
  } = useQuery(
    {
      queryKey: [namespace, profileId, tenantId],
      queryFn: ({ signal }) => ky.get(BULK_EDIT_PROFILES_API, { searchParams, signal }).json(),
      enabled: Boolean(profileId) && enabled,
      ...queryOptions,
    },
  );

  return {
    isFetching,
    isLoading,
    profile: data?.content?.[0],
  };
};
