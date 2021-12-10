import { getFileInfo } from './getFileInfo';

describe('getFileInfo', () => {
  it('should return correct data with supported cvs file type', () => {
    const testFile = new File([], 'test.csv');

    expect(getFileInfo(testFile)).toEqual({
      isTypeSupported: true,
      fileType: 'csv',
    });
  });

  it('should return correct data with supported cql file type', () => {
    const testFile = new File([], 'test.cql');

    expect(getFileInfo(testFile)).toEqual({
      isTypeSupported: false,
      fileType: 'cql',
    });
  });

  it('should return correct data with unsupported file type', () => {
    const testFile = new File([], 'test.txt');

    expect(getFileInfo(testFile)).toEqual({
      isTypeSupported: false,
      fileType: 'txt',
    });
  });
});
