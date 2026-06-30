import {
  getBulkOperationStatsByStep,
  getPaneSubtitle,
  iseRecordsPreviewAvailable,
  isErrorsPreviewAvailable,
} from './helpers';
import { EDITING_STEPS, JOB_STATUSES, OPERATION_TYPES } from '../../../../constants';

describe('getBulkOperationStatsByStep', () => {
  const bulkDetails = {
    matchedNumOfRecords: 10,
    committedNumOfRecords: 20,
    matchedNumOfErrors: 2,
    committedNumOfErrors: 3,
    matchedNumOfWarnings: 1,
    committedNumOfWarnings: 4,
    totalNumOfRecords: 30,
  };

  it('returns correct stats for initial preview step', () => {
    const result = getBulkOperationStatsByStep(bulkDetails, EDITING_STEPS.UPLOAD);
    expect(result).toEqual({
      countOfRecords: bulkDetails.matchedNumOfRecords,
      countOfErrors: bulkDetails.matchedNumOfErrors,
      countOfWarnings: bulkDetails.matchedNumOfWarnings,
      totalCount: bulkDetails.totalNumOfRecords,
      isOperationInPreviewStatus: false,
      isInitialPreview: true,
    });
  });

  it('returns correct stats for COMMIT preview step', () => {
    const result = getBulkOperationStatsByStep(bulkDetails, 'COMMIT');
    expect(result).toEqual({
      countOfRecords: bulkDetails.committedNumOfRecords,
      countOfErrors: bulkDetails.committedNumOfErrors,
      countOfWarnings: bulkDetails.committedNumOfWarnings,
      totalCount: bulkDetails.matchedNumOfRecords,
      isOperationInPreviewStatus: false,
      isInitialPreview: false,
    });
  });
});

describe('getPaneSubtitle', () => {
  it('returns the default subtitle when criteria is not active', () => {
    const result = getPaneSubtitle({
      isCriteriaActive: false,
      step: EDITING_STEPS.COMMIT,
      operationType: OPERATION_TYPES.UPDATE,
      countOfRecords: 10,
      totalCount: 20,
      recordType: 'user',
    });

    expect(result).toEqual({ id: 'ui-bulk-edit.list.logSubTitle' });
  });

  it('returns the matched subtitle on the UPLOAD step', () => {
    const result = getPaneSubtitle({
      isCriteriaActive: true,
      step: EDITING_STEPS.UPLOAD,
      operationType: OPERATION_TYPES.UPDATE,
      countOfRecords: 10,
      totalCount: 20,
      recordType: 'user',
    });

    expect(result).toEqual({
      id: 'ui-bulk-edit.list.logSubTitle.matched',
      values: { count: 10, recordType: 'user' },
    });
  });

  it('returns the changed subtitle on the COMMIT step for update operations', () => {
    const result = getPaneSubtitle({
      isCriteriaActive: true,
      step: EDITING_STEPS.COMMIT,
      operationType: OPERATION_TYPES.UPDATE,
      countOfRecords: 10,
      totalCount: 20,
      recordType: 'user',
    });

    expect(result).toEqual({
      id: 'ui-bulk-edit.list.logSubTitle.changed',
      values: { count: 10, recordType: 'user' },
    });
  });

  it('returns the two-part delete subtitle on the COMMIT step for delete operations', () => {
    const result = getPaneSubtitle({
      isCriteriaActive: true,
      step: EDITING_STEPS.COMMIT,
      operationType: OPERATION_TYPES.DELETE,
      countOfRecords: 85,
      totalCount: 88,
      recordType: 'user',
    });

    expect(result).toEqual({
      id: 'ui-bulk-edit.list.logSubTitle.delete',
      values: { matchedCount: 88, deletedCount: 85, recordType: 'user' },
    });
  });

  it('returns the matched subtitle for delete operations still on the UPLOAD step', () => {
    const result = getPaneSubtitle({
      isCriteriaActive: true,
      step: EDITING_STEPS.UPLOAD,
      operationType: OPERATION_TYPES.DELETE,
      countOfRecords: 88,
      totalCount: 88,
      recordType: 'user',
    });

    expect(result).toEqual({
      id: 'ui-bulk-edit.list.logSubTitle.matched',
      values: { count: 88, recordType: 'user' },
    });
  });
});

describe('iseRecordsPreviewAvailable', () => {
  describe('Initial Preview (UPLOAD step)', () => {
    it('returns true when status is in initialPreviewStatuses and records exist', () => {
      const bulkDetails = {
        matchedNumOfRecords: 5,
        status: JOB_STATUSES.DATA_MODIFICATION,
      };
      const result = iseRecordsPreviewAvailable(bulkDetails, EDITING_STEPS.UPLOAD);
      expect(result).toBe(true);
    });

    it('returns false when no records exist even if status is in initialPreviewStatuses', () => {
      const bulkDetails = {
        matchedNumOfRecords: 0,
        status: JOB_STATUSES.REVIEW_CHANGES,
      };
      const result = iseRecordsPreviewAvailable(bulkDetails, EDITING_STEPS.UPLOAD);
      expect(result).toBe(false);
    });

    it('returns false when status is not in initialPreviewStatuses', () => {
      const bulkDetails = {
        matchedNumOfRecords: 5,
        status: JOB_STATUSES.COMPLETED,
      };
      const result = iseRecordsPreviewAvailable(bulkDetails, EDITING_STEPS.UPLOAD);
      expect(result).toBe(false);
    });
  });

  describe('COMMIT Preview', () => {
    it('returns true when status is COMPLETED and records exist', () => {
      const bulkDetails = {
        committedNumOfRecords: 7,
        status: JOB_STATUSES.COMPLETED,
      };
      const result = iseRecordsPreviewAvailable(bulkDetails, 'COMMIT');
      expect(result).toBe(true);
    });

    it('returns true when status is COMPLETED_WITH_ERRORS and records exist', () => {
      const bulkDetails = {
        committedNumOfRecords: 7,
        status: JOB_STATUSES.COMPLETED_WITH_ERRORS,
      };
      const result = iseRecordsPreviewAvailable(bulkDetails, 'COMMIT');
      expect(result).toBe(true);
    });

    it('returns false when no records exist even if status is valid', () => {
      const bulkDetails = {
        committedNumOfRecords: 0,
        status: JOB_STATUSES.COMPLETED,
      };
      const result = iseRecordsPreviewAvailable(bulkDetails, 'COMMIT');
      expect(result).toBe(false);
    });

    it('returns false when status is not COMPLETED or COMPLETED_WITH_ERRORS', () => {
      const bulkDetails = {
        committedNumOfRecords: 5,
        status: JOB_STATUSES.DATA_MODIFICATION,
      };
      const result = iseRecordsPreviewAvailable(bulkDetails, 'COMMIT');
      expect(result).toBe(false);
    });
  });

  describe('Delete operation', () => {
    it('returns false when operationType is DELETE even if status and records are valid', () => {
      const bulkDetails = {
        committedNumOfRecords: 1,
        status: JOB_STATUSES.COMPLETED,
        operationType: OPERATION_TYPES.DELETE,
      };
      const result = iseRecordsPreviewAvailable(bulkDetails, 'COMMIT');
      expect(result).toBe(false);
    });
  });
});

describe('isErrorsPreviewAvailable', () => {
  describe('Initial Preview (UPLOAD step)', () => {
    it('returns true when status is in initialPreviewStatuses and errors exist', () => {
      const bulkDetails = {
        matchedNumOfErrors: 2,
        matchedNumOfWarnings: 0,
        status: JOB_STATUSES.REVIEWED_NO_MARC_RECORDS,
      };
      const result = isErrorsPreviewAvailable(bulkDetails, EDITING_STEPS.UPLOAD);
      expect(result).toBe(true);
    });

    it('returns true when status is in initialPreviewStatuses and warnings exist', () => {
      const bulkDetails = {
        matchedNumOfErrors: 0,
        matchedNumOfWarnings: 3,
        status: JOB_STATUSES.DATA_MODIFICATION_IN_PROGRESS,
      };
      const result = isErrorsPreviewAvailable(bulkDetails, EDITING_STEPS.UPLOAD);
      expect(result).toBe(true);
    });

    it('returns false when no errors or warnings exist', () => {
      const bulkDetails = {
        matchedNumOfErrors: 0,
        matchedNumOfWarnings: 0,
        status: JOB_STATUSES.REVIEW_CHANGES,
      };
      const result = isErrorsPreviewAvailable(bulkDetails, EDITING_STEPS.UPLOAD);
      expect(result).toBe(false);
    });

    it('returns false when status is not in initialPreviewStatuses', () => {
      const bulkDetails = {
        matchedNumOfErrors: 2,
        matchedNumOfWarnings: 0,
        status: JOB_STATUSES.COMPLETED,
      };
      const result = isErrorsPreviewAvailable(bulkDetails, EDITING_STEPS.UPLOAD);
      expect(result).toBe(false);
    });
  });

  describe('COMMIT step', () => {
    it('returns true when status is COMPLETED_WITH_ERRORS and errors exist', () => {
      const bulkDetails = {
        committedNumOfErrors: 2,
        committedNumOfWarnings: 0,
        status: JOB_STATUSES.COMPLETED_WITH_ERRORS,
      };
      const result = isErrorsPreviewAvailable(bulkDetails, 'COMMIT');
      expect(result).toBe(true);
    });

    it('returns true when status is COMPLETED_WITH_ERRORS and warnings exist', () => {
      const bulkDetails = {
        committedNumOfErrors: 0,
        committedNumOfWarnings: 1,
        status: JOB_STATUSES.COMPLETED_WITH_ERRORS,
      };
      const result = isErrorsPreviewAvailable(bulkDetails, 'COMMIT');
      expect(result).toBe(true);
    });

    it('returns false when no errors or warnings exist', () => {
      const bulkDetails = {
        committedNumOfErrors: 0,
        committedNumOfWarnings: 0,
        status: JOB_STATUSES.COMPLETED_WITH_ERRORS,
      };
      const result = isErrorsPreviewAvailable(bulkDetails, 'COMMIT');
      expect(result).toBe(false);
    });

    it('returns false when status is not COMPLETED_WITH_ERRORS', () => {
      const bulkDetails = {
        committedNumOfErrors: 2,
        committedNumOfWarnings: 0,
        status: JOB_STATUSES.COMPLETED,
      };
      const result = isErrorsPreviewAvailable(bulkDetails, 'COMMIT');
      expect(result).toBe(false);
    });
  });
});
