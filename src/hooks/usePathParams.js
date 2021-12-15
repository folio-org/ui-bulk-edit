import { matchPath } from 'react-router';
import { useLocation } from 'react-router-dom';

export const usePathParams = (path) => {
  const { pathname } = useLocation();
  const match = matchPath(pathname, { path });

  return match?.params || {};
};
