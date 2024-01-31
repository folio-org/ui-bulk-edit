import { getFileName } from './getFileName';
import { APPROACHES } from '../constants';

jest.mock('./date', () => ({
  getFormattedFilePrefixDate: jest.fn(() => 'mockedDate'),
}));

describe('getFileName', () => {
  it('should return the correct file name for Query approach - linkToTriggeringCsvFile', () => {
    const item = { approach: APPROACHES.QUERY, id: 123 };
    const triggeredFile = 'linkToTriggeringCsvFile';
    const result = getFileName(item, triggeredFile);
    expect(result).toBe('Query-123.csv');
  });

  it('should return the correct file name for Query approach - linkToMatchedRecordsCsvFile', () => {
    const item = { approach: APPROACHES.QUERY, id: 123 };
    const triggeredFile = 'linkToMatchedRecordsCsvFile';
    const result = getFileName(item, triggeredFile);
    expect(result).toBe('mockedDate-Matched-Records-Query-123.csv');
  });

  it('should return the correct file name for non-Query approach', () => {
    const item = { approach: APPROACHES.IN_APP, linkToTriggeringCsvFile: 'somePath/someFile.csv' };
    const triggeredFile = 'linkToTriggeringCsvFile';
    const result = getFileName(item, triggeredFile);
    expect(result).toBe('someFile.csv');
  });
});
