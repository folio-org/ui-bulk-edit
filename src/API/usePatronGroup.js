import {
  useQuery,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

export const usePatronGroup = () => {
  const ky = useOkapiKy();
  const { data } = useQuery(
    {
      queryKey: ['userGroupsMap'],
      queryFn: async () => {
        const { usergroups } = await ky.get('groups', { searchParams: { limit: 200 } }).json();

        return usergroups.reduce((acc, { group, desc }) => {
          const patronGroup = {
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
    userGroups: data || {},
  });
};
