import React from 'react';
import { InfoPopover } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import BulkEditLogsActions from '../components/BulkEditLogs/BulkEditLogsActions/BulkEditLogsActions';
import { FormattedTime } from './FormattedTime';
import { linkNamesMap } from './constants';

const isActionsRendered = (item) => Object.keys(item).some(key => Object.keys(linkNamesMap).includes(key));

export const getLogsResultsFormatter = (userNamesMap) => ({
  id: item => item.id,
  operationType: item => item.operationType && <FormattedMessage id={`ui-bulk-edit.logs.list.operationType.${item.operationType}`} />,
  entityType: item => <FormattedMessage id={`ui-bulk-edit.logs.list.entityType.${item.entityType}`} />,
  status: item => <FormattedMessage id={`ui-bulk-edit.logs.list.status.${item.status}`} />,
  userId: item => userNamesMap[item.userId],
  startTime: item => <FormattedTime dateString={item.startTime} />,
  endTime: item => <FormattedTime dateString={item.endTime} />,
  totalNumOfRecords: item => item.totalNumOfRecords,
  processedNumOfRecords: item => item.processedNumOfRecords,
  editing: item => item.approach && <FormattedMessage id={`ui-bulk-edit.logs.list.approach.${item.approach}`} />,
  actions: (item) => (
    <>
      {isActionsRendered(item) ? (
        <BulkEditLogsActions item={item} />
      ) : (
        <InfoPopover
          iconSize="medium"
          content={<FormattedMessage id="ui-bulk-edit.list.info.filesUnavailable" />}
        />
      )}
    </>
  ),
});
