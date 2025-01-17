import { saveAs } from 'file-saver';

import { getFormattedFilePrefixDate } from './date';


export const getFileName = (item, triggeredFile) => {
  if (item.fqlQueryId) {
    return {
      linkToTriggeringCsvFile: `Query-${item.id}.csv`,
      linkToMatchedRecordsCsvFile: `${getFormattedFilePrefixDate()}-Matched-Records-Query-${item.id}.csv`,
      linkToModifiedRecordsCsvFile: `${getFormattedFilePrefixDate()}-Updates-Preview-Query-${item.id}.csv`,
      linkToModifiedRecordsMarcFile: `${getFormattedFilePrefixDate()}-Updates-Preview-Query-${item.id}.mrc`,
      linkToCommittedRecordsCsvFile: `${getFormattedFilePrefixDate()}-Changed-Records-Query-${item.id}.csv`,
      linkToCommittedRecordsMarcFile: `${getFormattedFilePrefixDate()}-Changed-Records-Query-${item.id}.mrc`,
      linkToCommittedRecordsErrorsCsvFile: `${getFormattedFilePrefixDate()}-Committing-changes-Errors-Query-${item.id}.csv`,
      linkToMatchedRecordsErrorsCsvFile:`${getFormattedFilePrefixDate()}-Matching-Records-Errors-Query-${item.id}.csv`,
    }[triggeredFile];
  }

  return item[triggeredFile].split('/')[1];
};

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
