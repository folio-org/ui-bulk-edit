import {
  useQuery,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

export const useUserGroupsMap = () => {
  const ky = useOkapiKy();
  const { data } = useQuery(
    {
      queryKey: ['userGroupsMap'],
      queryFn: async () => {
        const { usergroups } = await ky.get('groups', { searchParams: { limit: 200 } }).json();

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
