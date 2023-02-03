import React from 'react';
import { FormattedMessage } from 'react-intl';

import { InfoPopover, NoValue } from '@folio/stripes/components';
import { FolioFormattedTime } from '@folio/stripes-acq-components';

import BulkEditLogsActions from '../components/BulkEditLogs/BulkEditLogsActions/BulkEditLogsActions';

export const getLogsResultsFormatter = (userNamesMap) => ({
  id: item => item.id,
  operationType: item => item.operationType,
  entityType: item => <FormattedMessage id={`ui-bulk-edit.logs.entityType.${item.entityType}`} />,
  status: item => <FormattedMessage id={`ui-bulk-edit.logs.status.${item.status}`} />,
  userId: item => userNamesMap[item.userId],
  startTime: item => <FolioFormattedTime dateString={item.startTime} />,
  endTime: item => <FolioFormattedTime dateString={item.endTime} />,
  totalNumOfRecords: item => item.totalNumOfRecords,
  processedNumOfRecords: item => item.processedNumOfRecords,
  editing: item => (
    item.approach
      ? <FormattedMessage id={`ui-bulk-edit.logs.approach.${item.approach}`} />
      : <NoValue />
  ),
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
