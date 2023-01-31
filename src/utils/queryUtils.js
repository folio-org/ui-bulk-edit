import { omit } from 'lodash';
import moment from 'moment';

import {
  SEARCH_PARAMETER,
  OFFSET_PARAMETER,
  LIMIT_PARAMETER,
  SORTING_PARAMETER,
  SORTING_DIRECTION_PARAMETER,
  SEARCH_INDEX_PARAMETER,
  DATE_RANGE_FILTER_FORMAT,
} from './constants';

export const buildArrayFieldQuery = (filterKey, filterValue) => {
  if (Array.isArray(filterValue)) {
    return `${filterKey}==(${filterValue.map(v => `"${v}"`).join(' or ')})`;
  }

  return `${filterKey}=="${filterValue}"`;
};

export const buildDateRangeQuery = (filterKey, filterValue) => {
  const [from, to] = filterValue.split(':');
  const start = moment(from).startOf('day').format(DATE_RANGE_FILTER_FORMAT);
  const end = moment(to).endOf('day').format(DATE_RANGE_FILTER_FORMAT);

  return `(${filterKey}>="${start}" and ${filterKey}<="${end}")`;
};

export const getFilterParams = (queryParams) => omit(
  queryParams,
  [SORTING_PARAMETER, SORTING_DIRECTION_PARAMETER, SEARCH_INDEX_PARAMETER, OFFSET_PARAMETER, LIMIT_PARAMETER],
);

export const buildFilterQuery = (queryParams, getSearchQuery, customFilterMap = {}) => {
  const filterParams = getFilterParams(queryParams);

  return Object.keys(filterParams).map((filterKey) => {
    const filterValue = queryParams[filterKey];
    const buildCustomFilterQuery = customFilterMap[filterKey];

    if (!filterValue) return false;

    if (filterKey === SEARCH_PARAMETER && filterValue) {
      return `(${getSearchQuery(filterValue, queryParams[SEARCH_INDEX_PARAMETER])})`;
    }

    if (buildCustomFilterQuery) {
      return buildCustomFilterQuery(filterValue);
    }

    if (Array.isArray(filterValue)) {
      return `${filterKey}==(${filterValue.map(v => `"${v}"`).join(' or ')})`;
    }

    return `${filterKey}=="${filterValue}"`;
  }).filter(q => q).join(' and ');
};

