import {
  useMutation,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import { CAPABILITIES } from '../../constants';

export const useJobCommand = ({ entityType }) => {
  const ky = useOkapiKy();

  const { mutateAsync: requestJobId, isLoading } = useMutation({
    mutationFn: ({ recordIdentifier: identifierType, editType, specificParameters }) => {
      const json = {
        type: editType,
        entityType: CAPABILITIES[entityType],
        exportTypeSpecificParameters: specificParameters || {},
        ...(identifierType && { identifierType }),
      };

      return ky.post('data-export-spring/jobs', { json }).json();
    },
  });

  return {
    requestJobId,
    isLoading,
  };
};
