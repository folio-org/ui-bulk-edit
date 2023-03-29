import {
  useQuery,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import { Group, GroupsDto } from './types';

export const usePatronGroup = () => {
  const ky = useOkapiKy();

  const { data, isLoading } = useQuery(
    {
      queryKey: ['userPatronGroup'],
      cacheTime: Infinity,
      staleTime: Infinity,
      queryFn: async () => {
        const { usergroups } = await ky.get('groups', { searchParams: { limit: 200 } }).json<GroupsDto>();

        return usergroups.reduce((acc : Group[], { group, desc, id } : Group) => {
          const patronGroup = {
            id,
            group,
            desc,
          };

          acc.push(patronGroup);

          return acc;
        }, []);
      },
    },
  );

  return ({
    isLoading,
    userGroups: data || {},
  });
};
