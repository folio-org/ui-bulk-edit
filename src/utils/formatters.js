import React from 'react';
import { FormattedMessage } from 'react-intl';

import { NoValue } from '@folio/stripes/components';
import { FolioFormattedTime } from '@folio/stripes-acq-components';

import BulkEditLogsActions from '../components/BulkEditLogs/BulkEditLogsActions/BulkEditLogsActions';
import { linkNamesMap } from '../constants';

const isActionsRendered = (item) => Object.keys(item).some(key => Object.keys(linkNamesMap).includes(key));

export const getLogsResultsFormatter = () => ({
  id: item => item.id,
  operationType: item => item.operationType,
  entityType: item => <FormattedMessage id={`ui-bulk-edit.logs.entityType.${item.entityType}`} />,
  status: item => <FormattedMessage id={`ui-bulk-edit.logs.status.${item.status}`} />,
  userId: item => item.runBy,
  startTime: item => <FolioFormattedTime dateString={item.startTime} />,
  endTime: item => <FolioFormattedTime dateString={item.endTime} />,
  totalNumOfRecords: item => item.totalNumOfRecords,
  processedNumOfRecords: item => item.processedNumOfRecords,
  editing: item => (
    item.approach
      ? <FormattedMessage id={`ui-bulk-edit.logs.approach.${item.approach}`} />
      : <NoValue />
  ),
  actions: (item) => isActionsRendered(item) && <BulkEditLogsActions item={item} />,
});
