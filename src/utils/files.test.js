import { saveAs } from 'file-saver';

import { getFileName, changeExtension, savePreviewFile } from './files';
import { getFormattedFilePrefixDate } from './date';


jest.mock('./date', () => ({
  getFormattedFilePrefixDate: jest.fn(() => 'mockedDate'),
}));

jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));


describe('files', () => {
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

  describe('changeExtension', () => {
    it('should change the extension of a file', () => {
      expect(changeExtension('abc.csv', 'mrc')).toBe('abc.mrc');
      expect(changeExtension('file.name.txt', 'md')).toBe('file.name.md');
    });

    it('should handle multiple extensions correctly', () => {
      expect(changeExtension('archive.tar.gz', 'zip')).toBe('archive.tar.zip');
    });
  });

  describe('savePreviewFile', () => {
    beforeEach(() => {
      jest.clearAllMocks();
    });

    it('should save the file with the correct name and extension for MARC approach', () => {
      const name = '2024-08-09-Updates-Preview-abc.mrc';
      const fileData = 'data';
      const fileName = `bulkId/${name}`;

      getFormattedFilePrefixDate.mockReturnValue('2024-08-09');

      savePreviewFile({
        fileName,
        fileData,
      });

      expect(saveAs).toHaveBeenCalledWith(
        new Blob([fileData]),
        name,
      );
    });
  });
});
