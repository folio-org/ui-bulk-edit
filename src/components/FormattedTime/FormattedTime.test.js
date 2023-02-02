import { NoValue } from '@folio/stripes/components';
import { FormattedTime } from './FormattedTime';

const dateStringMock = '2021-06-17T09:47:04.607Z';

describe('FormattedTime', () => {
  it('should return correct date string', () => {
    expect(FormattedTime({ dateString: dateStringMock })).toBe('2021-06-17');
  });

  it('should return NoValue', () => {
    expect(FormattedTime({ dateString: null })).toStrictEqual(<NoValue />);
  });
});

