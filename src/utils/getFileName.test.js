import { getFileName } from './getFileName';

jest.mock('./date', () => ({
  getFormattedFilePrefixDate: jest.fn(() => 'mockedDate'),
}));

describe('getFileName', () => {
  it('should return the correct file name for Query approach - linkToTriggeringCsvFile', () => {
    const item = { fqlQueryId: '111', id: 123 };
    const triggeredFile = 'linkToTriggeringCsvFile';
    const result = getFileName(item, triggeredFile);
    expect(result).toBe('Query-123.csv');
  });

  it('should return the correct file name for Query approach - linkToMatchedRecordsCsvFile', () => {
    const item = { fqlQueryId: '111', id: 123 };
    const triggeredFile = 'linkToMatchedRecordsCsvFile';
    const result = getFileName(item, triggeredFile);
    expect(result).toBe('mockedDate-Matched-Records-Query-123.csv');
  });

  it('should return the correct file name for non-Query approach', () => {
    const item = { fqlQueryId: null, linkToTriggeringCsvFile: 'somePath/someFile.csv' };
    const triggeredFile = 'linkToTriggeringCsvFile';
    const result = getFileName(item, triggeredFile);
    expect(result).toBe('someFile.csv');
  });
});
