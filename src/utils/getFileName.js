import { getFormattedFilePrefixDate } from '../constants';

export const getFileName = (item, triggeredFile) => {
  if (item.fqlQueryId) {
    return {
      linkToTriggeringCsvFile: `Query-${item.id}.csv`,
      linkToMatchedRecordsCsvFile: `${getFormattedFilePrefixDate()}-Matched-Records-Query-${item.id}.csv`,
      linkToModifiedRecordsCsvFile: `${getFormattedFilePrefixDate()}-Updates-Preview-Query-${item.id}.csv`,
      linkToCommittedRecordsCsvFile: `${getFormattedFilePrefixDate()}-Changed-Records-Query-${item.id}.csv`,
      linkToCommittedRecordsErrorsCsvFile: `${getFormattedFilePrefixDate()}-Committing-changes-Errors-Query-${item.id}.csv`
    }[triggeredFile];
  }

  return item[triggeredFile].split('/')[1];
};
