import {
  EDITING_STEPS,
  JOB_STATUSES,
} from '../../../constants';

export const getBulkOperationStep = (bulkOperation) => {
  if (!bulkOperation) return undefined;

  switch (true) {
    case bulkOperation.status === JOB_STATUSES.COMPLETED:
    case (
      bulkOperation.status === JOB_STATUSES.COMPLETED_WITH_ERRORS
      && (Boolean(bulkOperation.committedNumOfErrors) || Boolean(bulkOperation.committedNumOfWarnings))
    ):
      return EDITING_STEPS.COMMIT;
    case bulkOperation.status === JOB_STATUSES.DATA_MODIFICATION:
    case bulkOperation.status === JOB_STATUSES.COMPLETED_WITH_ERRORS:
      return EDITING_STEPS.UPLOAD;
    default:
      return undefined;
  }
};
