import {
  useQuery,
} from 'react-query';

import { useNamespace, useOkapiKy } from '@folio/stripes/core';

export const GROUP_MAP_KEYS = 'GROUP_MAP_KEYS';

export const useUserGroupsMap = () => {
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: GROUP_MAP_KEYS });

  const { data } = useQuery(
    {
      queryKey: [namespaceKey],
      cacheTime: Infinity,
      staleTime: Infinity,
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
