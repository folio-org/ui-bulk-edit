import { useQuery } from 'react-query';
import { useNamespace, useOkapiKy } from '@folio/stripes/core';

export const PREVIEW_ERRORS_KEY = 'PREVIEW_ERRORS_KEY';

export const useErrorsPreview = ({ id }) => {
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: PREVIEW_ERRORS_KEY });

  const { data, isLoading } = useQuery(
    {
      queryKey: [namespaceKey, id],
      cacheTime: 0,
      enabled: !!id,
      queryFn: () => ky.get(`bulk-operations/${id}/errors`, { searchParams: { limit: 10 } }).json(),
    },
  );

  return { data, isLoading };
};
