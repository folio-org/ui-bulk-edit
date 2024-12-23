import { useQuery } from 'react-query';
import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { useErrorMessages } from '../useErrorMessages';
import { PREVIEW_LIMITS } from '../../constants';

export const PREVIEW_ERRORS_KEY = 'PREVIEW_ERRORS_KEY';

export const useErrorsPreview = ({
  id,
  enabled,
  offset = 0,
  limit = PREVIEW_LIMITS.ERRORS,
}) => {
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: PREVIEW_ERRORS_KEY });

  const { showErrorMessage } = useErrorMessages();

  const { data, isFetching } = useQuery(
    {
      queryKey: [namespaceKey, id, limit, offset],
      queryFn: () => ky.get(`bulk-operations/${id}/errors`, { searchParams: { limit, offset } }).json(),
      onError: showErrorMessage,
      onSuccess: showErrorMessage,
      keepPreviousData: true,
      enabled,
    },
  );

  return {
    errors: data?.errors || [],
    isFetching,
  };
};
