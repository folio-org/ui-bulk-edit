export const buildQuery = (query, userGroups) => {
  const swappedEntries = Object.entries(userGroups).map(([key, value]) => [value, key]);
  const groupsMap = Object.fromEntries(swappedEntries);

  const parsedQuery = query.replace(
    /('|"|)((patron group)|status)('|"|)=('|"|)(.+)('|"|)/i,
    (match, _1, searchType, _3, _4, _5, value) => {
      switch (searchType.toLowerCase()) {
        case 'patron group':
          return `patronGroup=${groupsMap[value]}`;
        case 'status':
          return `active=${value === 'active'}`;
        default:
          return match;
      }
    },
  );

  return parsedQuery || {};
};
