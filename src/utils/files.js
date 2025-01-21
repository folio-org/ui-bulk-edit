import { saveAs } from 'file-saver';

export const changeExtension = (fileName, extension) => {
  if (!fileName) return fileName;

  const fileNameParts = fileName.split('.');
  fileNameParts.pop();
  return `${fileNameParts.join('.')}.${extension}`;
};

export const savePreviewFile = ({
  fileName,
  fileData,
}) => {
  const name = fileName.split('/')[1];

  saveAs(new Blob([fileData]), name);
};
