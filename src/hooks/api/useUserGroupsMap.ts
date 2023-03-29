import {
  useQuery,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import { GroupsDto } from './types';

export const useUserGroupsMap = () => {
  const ky = useOkapiKy();
  const { data } = useQuery(
    {
      queryKey: ['userGroupsMap'],
      cacheTime: Infinity,
      staleTime: Infinity,
      queryFn: async () => {
        const { usergroups } = await ky.get('groups', { searchParams: { limit: 200 } }).json<GroupsDto>();

        return usergroups.reduce((acc, curr) => (
          {
            ...acc,
            [curr.id]: curr.group,
          }
        ), {});
      },
    },
  );

  return ({
    userGroups: data || {},
  });
};
