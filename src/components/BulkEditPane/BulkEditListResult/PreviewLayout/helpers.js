import { EDITING_STEPS, JOB_STATUSES } from '../../../../constants';

const initialPreviewStatuses = [
  JOB_STATUSES.DATA_MODIFICATION,
  JOB_STATUSES.DATA_MODIFICATION_IN_PROGRESS,
  JOB_STATUSES.REVIEW_CHANGES,
  JOB_STATUSES.REVIEWED_NO_MARC_RECORDS
];

export const getBulkOperationStatsByStep = (bulkDetails, step) => {
  const isInitialPreview = step === EDITING_STEPS.UPLOAD;

  const countOfRecords = isInitialPreview
    ? bulkDetails.matchedNumOfRecords
    : bulkDetails.committedNumOfRecords;

  const countOfErrors = isInitialPreview
    ? bulkDetails.matchedNumOfErrors
    : bulkDetails.committedNumOfErrors;

  const countOfWarnings = isInitialPreview
    ? bulkDetails.matchedNumOfWarnings
    : bulkDetails.committedNumOfWarnings;

  const totalCount = isInitialPreview
    ? bulkDetails.totalNumOfRecords
    : bulkDetails.matchedNumOfRecords;

  return {
    countOfRecords,
    countOfErrors,
    countOfWarnings,
    totalCount,
    isInitialPreview
  };
};

export const iseRecordsPreviewAvailable = (bulkDetails, step) => {
  const { isInitialPreview, countOfRecords } = getBulkOperationStatsByStep(bulkDetails, step);

  const hasRecords = countOfRecords > 0;

  if (isInitialPreview) {
    return initialPreviewStatuses.includes(bulkDetails.status) && hasRecords;
  } else {
    return [
      JOB_STATUSES.COMPLETED,
      JOB_STATUSES.COMPLETED_WITH_ERRORS
    ].includes(bulkDetails.status) && hasRecords;
  }
};

export const isErrorsPreviewAvailable = (bulkDetails, step) => {
  const { isInitialPreview, countOfErrors, countOfWarnings } = getBulkOperationStatsByStep(bulkDetails, step);

  const hasErrorsOrWarnings = countOfErrors > 0 || countOfWarnings > 0;

  if (isInitialPreview) {
    return initialPreviewStatuses.includes(bulkDetails.status) && hasErrorsOrWarnings;
  } else {
    return [
      JOB_STATUSES.COMPLETED_WITH_ERRORS
    ].includes(bulkDetails.status) && hasErrorsOrWarnings;
  }
};
