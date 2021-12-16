import {
  useQuery,
} from 'react-query';


import { useOkapiKy } from '@folio/stripes/core';

export const usePreviewRecords = (id) => {
  const ky = useOkapiKy();

  const { data } = useQuery('previewRecords', { queryFn: () => {
    return ky.get(`bulk-edit/${id}/preview`).json();
  } });

  return {
    data,
  };
};
