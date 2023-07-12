import {
  useQuery,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

export const usePatronGroup = (options = {}) => {
  const ky = useOkapiKy();

  const { data, isLoading } = useQuery(
    {
      queryKey: ['userPatronGroup'],
      cacheTime: Infinity,
      staleTime: Infinity,
      queryFn: async () => {
        const { usergroups } = await ky.get('groups', { searchParams: { limit: 200 } }).json();

        return usergroups.reduce((acc, { group, desc, id }) => {
          const patronGroup = {
            id,
            group,
            desc,
          };

          acc.push(patronGroup);

          return acc;
        }, []);
      },
      ...options,
    },
  );

  return ({
    isLoading,
    userGroups: data || {},
  });
};
