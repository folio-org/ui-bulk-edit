import { saveAs } from 'file-saver';

import { changeExtension, savePreviewFile } from './files';


jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));


describe('files', () => {
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
