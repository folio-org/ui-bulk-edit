import { useMemo } from 'react';
import queryString from 'query-string';

import {
  SORTING_PARAMETER,
  SORTING_DIRECTION_PARAMETER,
} from '@folio/stripes-acq-components';

import { LOGS_FILTERS } from '../constants';

const queryFields = [SORTING_PARAMETER, SORTING_DIRECTION_PARAMETER, ...Object.values(LOGS_FILTERS)];

export const useLogsQueryParams = ({ search }) => {
  const logsQueryParams = useMemo(() => {
    const queryParams = queryString.parse(search);

    return Object.keys(queryParams).reduce((acc, key) => {
      if (queryFields.some(field => field === key)) {
        acc[key] = queryParams[key];
      }

      return acc;
    }, {});
  }, [search]);

  return { logsQueryParams };
};
