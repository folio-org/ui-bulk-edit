import { getFileExtension } from '@folio/stripes-data-transfer-components';
import { SUPPORTED_FILE_EXTENSIONS } from '../../../../constants/constants';

export const getFileInfo = file => {
  const fileType = getFileExtension(file).slice(1);

  console.log(Boolean(SUPPORTED_FILE_EXTENSIONS.includes(fileType)));

  return {
    isTypeSupported: Boolean(SUPPORTED_FILE_EXTENSIONS.includes(fileType)),
    fileType,
  };
};
