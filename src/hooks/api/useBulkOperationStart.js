import { useRef } from 'react';
import { useMutation, useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { useIntl } from 'react-intl';
import { useShowCallout } from '@folio/stripes-acq-components';
import {
  IDENTIFIERS,
  JOB_STATUSES,
  EDITING_STEPS,
} from '../../constants';

export const useBulkOperationStart = (mutationOptions = {}) => {
  const params = useRef({});
  const ky = useOkapiKy();
  const intl = useIntl();
  const callout = useShowCallout();

  const { refetch: fetchBulkOperation } = useQuery({
    queryFn: async () => {
      const { id, step } = params.current;

      const bulkOperation = await ky.get(`bulk-operations/${id}`).json();

      if (
        step === EDITING_STEPS.EDIT
        && ![JOB_STATUSES.REVIEW_CHANGES, JOB_STATUSES.FAILED].includes(bulkOperation.status)
      ) {
        return Promise.reject();
      }

      return bulkOperation;
    },
    cacheTime: 0,
    retryDelay: 2000,
    retry: true,
    enabled: false,
  });

  const { mutateAsync: bulkOperationStart, isLoading, data: startData } = useMutation({
    mutationFn: async ({
      id,
      approach,
      entityType,
      step,
      query,
    }) => {
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

      params.current = { id, step };

      try {
        const startResult = await ky.post(`bulk-operations/${id}/start`, {
          json: body,
        });

        if (startResult?.errorMessage) {
          callout({
            type: 'error',
            message: intl.formatMessage({ id: `ui-bulk-edit.${startResult.errorMessage}` }),
          });
        }

      // eslint-disable-next-line no-empty
      } catch (e) {}

      const { data } = await fetchBulkOperation();

      return data;
    },
    ...mutationOptions,
  });

  return {
    bulkOperationStart,
    isLoading,
    startData
  };
};
