import {
  useQuery,
} from 'react-query';


import { useOkapiKy } from '@folio/stripes/core';

export const useDownloadErrors = (id) => {
  const ky = useOkapiKy();

  const { data } = useQuery('error-download', { queryFn: () => {
    return ky.get(`data-export-spring/jobs/${id}`).json();
  } });

  return {
    data,
  };
};
