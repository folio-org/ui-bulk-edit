import { EDITING_STEPS, JOB_STATUSES } from '../../../../constants';

// Array of bulk operation statuses that indicate the operation is in its initial preview phase (UPLOAD phase).
const initialPreviewStatuses = [
  JOB_STATUSES.DATA_MODIFICATION,
  JOB_STATUSES.DATA_MODIFICATION_IN_PROGRESS,
  JOB_STATUSES.REVIEW_CHANGES,
  JOB_STATUSES.REVIEWED_NO_MARC_RECORDS,
  JOB_STATUSES.COMPLETED_WITH_ERRORS
];

// Array of bulk operation statuses that indicate the operation is in its last preview phase (COMMIT phase).
const commitPreviewStatuses = [
  JOB_STATUSES.COMPLETED,
  JOB_STATUSES.COMPLETED_WITH_ERRORS
];

export const possiblePreviewStatuses = [
  ...initialPreviewStatuses,
  ...commitPreviewStatuses,
  JOB_STATUSES.APPLY_CHANGES,
  JOB_STATUSES.APPLY_MARC_CHANGES
];

/**
 * Computes and returns various statistics for a bulk operation based on the current step.
 *   - countOfRecords: The number of records relevant to the current step.
 *   - countOfErrors: The number of errors relevant to the current step.
 *   - countOfWarnings: The number of warnings relevant to the current step.
 *   - totalCount: The total count of records, which differs based on the step.
 *   - isInitialPreview: A boolean indicating whether the current step is the initial preview (UPLOAD).
 */
export const getBulkOperationStatsByStep = (bulkDetails = {}, step) => {
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

  const isOperationInPreviewStatus = possiblePreviewStatuses.includes(bulkDetails.status);

  return {
    countOfRecords,
    countOfErrors,
    countOfWarnings,
    totalCount,
    isInitialPreview,
    isOperationInPreviewStatus
  };
};

/**
 * Determines whether a records preview is available for the bulk operation.
 * Based on it useQuery `enabled` prop will be true or false.
 * It used to prevent unnecessary requests to the server.
 */
export const iseRecordsPreviewAvailable = (bulkDetails, step) => {
  const { isInitialPreview, countOfRecords } = getBulkOperationStatsByStep(bulkDetails, step);

  const hasRecords = countOfRecords > 0;

  if (isInitialPreview) {
    return initialPreviewStatuses.includes(bulkDetails.status) && hasRecords;
  } else {
    return commitPreviewStatuses.includes(bulkDetails.status) && hasRecords;
  }
};

/**
 * Determines whether an errors preview is available for the bulk operation.
 * Based on it useQuery `enabled` prop will be true or false.
 * It used to prevent unnecessary requests to the server.
 */
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
