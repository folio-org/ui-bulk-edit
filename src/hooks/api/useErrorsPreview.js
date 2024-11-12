import { useQuery } from 'react-query';
import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { useErrorMessages } from '../useErrorMessages';

export const PREVIEW_ERRORS_KEY = 'PREVIEW_ERRORS_KEY';

export const useErrorsPreview = ({ id, queryOptions = {} }) => {
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: PREVIEW_ERRORS_KEY });

  const { showErrorMessage } = useErrorMessages();

  const { data, isLoading } = useQuery(
    {
      queryKey: [namespaceKey, id],
      queryFn: () => ky.get(`bulk-operations/${id}/errors`, { searchParams: { limit: 10 } }).json(),
      onError: showErrorMessage,
      onSuccess: showErrorMessage,
      ...queryOptions,
    },
  );

  return { data, isLoading };
};
