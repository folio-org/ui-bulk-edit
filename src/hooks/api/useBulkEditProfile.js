import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { CQLBuilder } from '@folio/stripes-acq-components';

import { BULK_EDIT_PROFILES_API } from '../../constants';

export const PROFILE_DETAILS_KEY = 'PROFILE_DETAILS_KEY';

export const useBulkEditProfile = (profileId, options = {}) => {
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: PROFILE_DETAILS_KEY });

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
