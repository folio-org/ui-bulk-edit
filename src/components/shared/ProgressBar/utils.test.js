import {
  EDITING_STEPS,
  JOB_STATUSES,
} from '../../../constants';

import { getBulkOperationStep } from './utils';

describe('ProgressBar utils', () => {
  it('should return COMMIT step for completed operation', () => {
    const bulkOperation = {
      status: JOB_STATUSES.COMPLETED,
    };

    expect(getBulkOperationStep(bulkOperation)).toBe(EDITING_STEPS.COMMIT);
  });

  it('should return COMMIT step for completed with errors operation (after execution)', () => {
    const bulkOperation = {
      status: JOB_STATUSES.COMPLETED_WITH_ERRORS,
      committedNumOfErrors: 1,
    };

    expect(getBulkOperationStep(bulkOperation)).toBe(EDITING_STEPS.COMMIT);
  });

  it('should return UPLOAD step for completed with errors operation (after upload)', () => {
    const bulkOperation = {
      status: JOB_STATUSES.COMPLETED_WITH_ERRORS,
    };

    expect(getBulkOperationStep(bulkOperation)).toBe(EDITING_STEPS.UPLOAD);
  });

  it('should return UPLOAD step for operation in data modification status', () => {
    const bulkOperation = {
      status: JOB_STATUSES.DATA_MODIFICATION,
    };

    expect(getBulkOperationStep(bulkOperation)).toBe(EDITING_STEPS.UPLOAD);
  });

  it('should not return status when operation is not defined', () => {
    expect(getBulkOperationStep(undefined)).not.toBeDefined();
    expect(getBulkOperationStep(null)).not.toBeDefined();
  });

  it('should not return status when no matches between status and steps', () => {
    expect(getBulkOperationStep({ step: JOB_STATUSES.REVIEW_CHANGES })).not.toBeDefined();
  });
});
