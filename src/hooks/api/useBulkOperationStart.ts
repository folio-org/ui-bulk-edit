import { useRef, MutableRefObject } from 'react';
import { useMutation, useQuery } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import {
  IDENTIFIERS,
  JOB_STATUSES,
  EDITING_STEPS,
} from '../../constants';
import { Approach, BulkOperationDto, EntityType, Params, Step } from './types';

export const useBulkOperationStart = (mutationOptions = {}) => {
  const params = useRef<Params>({});
  const ky = useOkapiKy();

  const { refetch: fetchBulkOperation } = useQuery({
    queryFn: async () => {
      const { id, step } = params.current;

      const bulkOperation = await ky.get(`bulk-operations/${id}`).json<BulkOperationDto>();

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

  const { mutateAsync: bulkOperationStart, isLoading } = useMutation({
    mutationFn: async ({
      id,
      approach,
      entityType,
      step,
      query,
    } : {
      id: string,
      approach: Approach,
      entityType: EntityType,
      step: Step,
      query : string,
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
        await ky.post(`bulk-operations/${id}/start`, {
          json: body,
        });
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
  };
};
