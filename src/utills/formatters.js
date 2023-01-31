import { InfoPopover } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import React from 'react';
import BulkEditLogsActions from '../components/BulkEditLogs/BulkEditLogsActions/BulkEditLogsActions';

export const getLogsResultsFormatter = () => ({
  jobId: item => item.jobId,
  bulkOperationType: item => item.bulkOperationType,
  recordType: item => item.recordType,
  status: item => item.status,
  runBy: item => item.runBy,
  startedRunning: item => item.startedRunning,
  endedRunning: item => item.endedRunning,
  numberOfRecords: item => item.numberOfRecords,
  processed: item => item.processed,
  editing: item => item.editing,
  actions: (item) => (
    <>
      {item.processed === 12 ? (
        <BulkEditLogsActions />
      ) : (
        <InfoPopover
          iconSize="medium"
          content={<FormattedMessage id="ui-bulk-edit.list.info.filesUnavailable" />}
        />
      )}
    </>
  ),
});
