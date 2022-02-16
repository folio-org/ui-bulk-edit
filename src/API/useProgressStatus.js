import {
  useQuery,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import { useShowCallout } from '@folio/stripes-acq-components';
import { useIntl } from 'react-intl';

export const useProgressStatus = (id) => {
  const [refetchInterval, setRefetchInterval] = useState(500);
  const callout = useShowCallout();
  const intl = useIntl();

  const history = useHistory();

  const ky = useOkapiKy();

  const clearIntervalAndRedirect = (pathname) => {
    setRefetchInterval(0);

    history.replace({
      pathname,
      search: history.location.search,
    });
  };

  const { data } = useQuery({
    queryKey: ['progress', id],
    queryFn: () => ky.get(`data-export-spring/jobs/${id}`).json(),
    enabled: !!id,
    refetchInterval,
    onSuccess: () => {
      switch (data?.status) {
        case 'SUCCESSFUL':
          clearIntervalAndRedirect(`/bulk-edit/${id}/processed`);
          break;
        case 'FAILED':
          clearIntervalAndRedirect(`/bulk-edit/${id}/initial`);

          callout({
            type: 'error',
            message: intl.formatMessage({ id: 'ui-bulk-edit.error.sww' }),
          });
          break;
        default:
      }
    },
  });

  return {
    data,
  };
};
