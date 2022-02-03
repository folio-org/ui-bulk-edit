import {
  useQuery,
} from 'react-query';


import { useOkapiKy } from '@folio/stripes/core';

export const usePreviewRecords = (id) => {
  const ky = useOkapiKy();
  const { data } = useQuery(['previewRecords'],
    {
      queryFn: async () => {
        const { users, totalRecords } = await ky.get(`bulk-edit/${id}/preview`, { searchParams: { limit: 10 } }).json();
        const { usergroups } = await ky.get('groups', { searchParams: { limit: 200 } }).json();

        const groupsMap = usergroups.reduce((acc, curr) => (
          {
            ...acc,
            [curr.id]: curr.group,
          }
        ), {});

        return {
          users: users.map(user => {
            return {
              ...user,
              patronGroup: groupsMap[user.patronGroup],
            };
          }),
          totalRecords,
        };
      },
      enabled: !!id,
    });

  return ({
    users: data?.users || [],
    totalRecords: data?.totalRecords,
  });
};
