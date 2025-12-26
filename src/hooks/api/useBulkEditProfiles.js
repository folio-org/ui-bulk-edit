import { useQuery } from 'react-query';

import {
  useNamespace,
  useOkapiKy,
} from '@folio/stripes/core';
import { batchRequest, CQLBuilder } from '@folio/stripes-acq-components';

import { getFullName } from '@folio/stripes/util';
import { BULK_EDIT_PROFILES_API } from '../../constants';
import { useErrorMessages } from '../useErrorMessages';

export const BULK_EDIT_PROFILES_KEY = 'BULK_EDIT_PROFILES_KEY';

const ERROR_SOURCE_PROFILES = 'profiles';
const ERROR_SOURCE_USERS = 'users';

const groupByEntityType = (entityTypes) => (builder) => {
  entityTypes.forEach((t) => {
    builder.or().equal('entityType', t);
  });
};

export const useBulkEditProfiles = (params = {}, options = {}) => {
  const { entityTypes } = params;
  const {
    enabled = true,
    tenantId,
    ...queryOptions
  } = options;

  const ky = useOkapiKy({ tenant: tenantId });
  const [namespace] = useNamespace({ key: BULK_EDIT_PROFILES_KEY });
  const { showErrorMessage, showExternalModuleError } = useErrorMessages({ path: 'users' });

  const cqlBuilder = new CQLBuilder();
  const query = entityTypes?.length > 0
    ? (
      cqlBuilder
        .group(groupByEntityType(entityTypes))
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
      queryKey: [namespace, tenantId, entityTypes],
      queryFn: async ({ signal }) => {
        let profiles;

        try {
          profiles = await ky.get(BULK_EDIT_PROFILES_API, { searchParams: { query, offset: 0, limit: 1000 }, signal })
            .json()
            .then(({ content }) => content);
        } catch (error) {
          error.source = ERROR_SOURCE_PROFILES;
          throw error;
        }

        const userIds = profiles.map(profile => profile.updatedBy).filter(Boolean);

        let response;
        try {
          response = await batchRequest(
            ({ params: usersParams }) => ky.get('users', { searchParams: usersParams, signal }).json(),
            userIds,
          );
        } catch (error) {
          error.source = ERROR_SOURCE_USERS;
          throw error;
        }

        const flatUsers = response.flatMap(({ users }) => users);
        const usersMap = new Map(flatUsers.map(user => [user.id, user]));

        return profiles.map(profile => ({
          ...profile,
          userFullName: getFullName(usersMap.get(profile.updatedBy)),
        }));
      },
      enabled,
      keepPreviousData: true,
      onError: (error) => {
        if (error?.source === ERROR_SOURCE_USERS) {
          showExternalModuleError(error);
        } else {
          showErrorMessage(error);
        }
      },
      ...queryOptions,
    },
  );

  return {
    isFetching,
    isLoading,
    profiles: data ?? [],
  };
};
