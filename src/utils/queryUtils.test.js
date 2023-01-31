import moment from 'moment';
import * as queryUtils from './queryUtils';

import { DATE_RANGE_FILTER_FORMAT } from './constants';

describe('queryUtils', () => {
  describe('buildArrayFieldQuery', () => {
    const outputArrayQuery = 'entityType==("USER" or "ITEM")';
    const outputSingleQuery = 'entityType=="USER"';

    it('should return query based on filter key and array value', () => {
      expect(
        queryUtils.buildArrayFieldQuery('entityType', ['USER', 'ITEM']),
      ).toEqual(outputArrayQuery);
    });

    it('should return query based on filter key and single value', () => {
      expect(
        queryUtils.buildArrayFieldQuery('entityType', 'USER'),
      ).toEqual(outputSingleQuery);
    });
  });

  describe('buildDateRangeQuery', () => {
    const start = moment('2014-07-14').startOf('day').format(DATE_RANGE_FILTER_FORMAT);
    const end = moment('2020-07-14').endOf('day').format(DATE_RANGE_FILTER_FORMAT);

    it('should return query based on filter key and value', () => {
      expect(
        queryUtils.buildDateRangeQuery('date', '2014-07-14:2020-07-14'),
      ).toEqual(`(date>="${start}" and date<="${end}")`);
    });
  });
});
