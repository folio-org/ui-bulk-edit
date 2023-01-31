import { InfoPopover } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import React from 'react';
import BulkEditLogsActions from '../components/BulkEditLogs/BulkEditLogsActions/BulkEditLogsActions';
import { FormattedTime } from '../utils/FormattedTime';

export const getLogsResultsFormatter = (userNamesMap) => ({
  id: item => item.id,
  operationType: item => item.operationType,
  entityType: item => item.entityType,
  status: item => item.status,
  userId: item => userNamesMap[item.userId],
  startTime: item => <FormattedTime dateString={item.startTime} />,
  endTime: item => <FormattedTime dateString={item.endTime} />,
  totalNumOfRecords: item => item.totalNumOfRecords,
  processedNumOfRecords: item => item.processedNumOfRecords,
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
