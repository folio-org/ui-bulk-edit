import { useOkapiKy } from '@folio/stripes/core';
import { useMutation } from 'react-query';

import { IDENTIFIERS } from '../../constants';

export const useBulkOperationStart = (mutationOptions = {}) => {
  const ky = useOkapiKy();

  const { mutateAsync: bulkOperationStart, isLoading } = useMutation({
    mutationFn: ({ id, approach, entityType, step, query }) => {
      const body = query
        ? {
          step,
          approach,
          query,
          entityType,
          entityCustomIdentifierType: IDENTIFIERS.ID,
        }
        : {
          step,
          approach,
        };

      return ky.post(`bulk-operations/${id}/start`, {
        json: body,
      }).json();
    },
    ...mutationOptions,
  });

  return {
    bulkOperationStart,
    isLoading,
  };
};
