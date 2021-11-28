import {
  useMutation,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { API_PATH } from '../constants/constants';

export const useFileUploadComand = (options = {}) => {
  const ky = useOkapiKy();

  const { data: jobId } = useMutation({
    mutationFn: (fileName) => {
      const kyPath = `${API_PATH}/jobs–createJobCommand`;

      return ky.post(kyPath, { json: fileName });
    },
    ...options,
  });

  return {
    data: jobId,
  };
};
