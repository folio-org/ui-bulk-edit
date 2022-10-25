import {
  useQuery,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import { useHistory } from 'react-router-dom';
import { useState } from 'react';
import { useShowCallout } from '@folio/stripes-acq-components';
import { useIntl } from 'react-intl';
import {
  JOB_STATUSES,
  BULK_EDIT_IDENTIFIERS,
} from '../constants';

export const useProgressStatus = (id, typeOfProgress, options = {}) => {
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

  const { data, remove } = useQuery({
    queryKey: ['progress', id],
    queryFn: () => ky.get(`data-export-spring/jobs/${id}`).json(),
    enabled: !!id,
    refetchInterval,
    onSuccess: () => {
      const isProgress = data?.progress?.progress === 100;

      switch (data?.status) {
        case JOB_STATUSES.SUCCESSFUL:
          if (data?.type === BULK_EDIT_IDENTIFIERS && isProgress) {
            clearIntervalAndRedirect(`/bulk-edit/${id}/${typeOfProgress}`);
          } else clearIntervalAndRedirect(`/bulk-edit/${id}/${typeOfProgress}`);

          break;
        case JOB_STATUSES.FAILED:
          clearIntervalAndRedirect(`/bulk-edit/${id}/initial`);

          callout({
            type: 'error',
            message: intl.formatMessage({ id: 'ui-bulk-edit.error.sww' }),
          });
          break;
        default:
      }
    },
    ...options,
  });

  return {
    data,
    remove,
  };
};
