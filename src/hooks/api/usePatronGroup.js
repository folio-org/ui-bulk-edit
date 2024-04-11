import {
  useQuery,
} from 'react-query';

import { useNamespace, useOkapiKy } from '@folio/stripes/core';

export const PATRON_GROUP_KEY = 'PATRON_GROUP_KEY';

export const usePatronGroup = (options = {}) => {
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: PATRON_GROUP_KEY });

  const { data, isLoading } = useQuery(
    {
      queryKey: [namespaceKey],
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
