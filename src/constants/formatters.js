import { AppIcon } from '@folio/stripes/core';
import { InfoPopover } from '@folio/stripes/components';

import { FormattedMessage } from 'react-intl';
import React from 'react';
import { FormattedTime } from '../utils/FormattedTime';
import BulkEditLogsActions from '../components/BulkEditLogs/BulkEditLogsActions/BulkEditLogsActions';

export const getUserResultsFormatterBase = (userGroups) => ({
  active: user => (
    <AppIcon app="users" size="small">
      {user.active
        ? <FormattedMessage id="ui-bulk-edit.list.preview.table.active" />
        : <FormattedMessage id="ui-bulk-edit.list.preview.table.inactive" />
      }
    </AppIcon>
  ),
  lastName: user => user.personal?.lastName,
  firstName: user => user.personal?.firstName,
  barcode: user => user.barcode,
  patronGroup: user => userGroups[user.patronGroup],
  username: user => user.username,
});

export const getUserResultsFormatter = (userGroups) => ({
  ...getUserResultsFormatterBase(userGroups),
  email: user => user.personal?.email,
  expirationDate: user => <FormattedTime dateString={user.expirationDate} />,
});

export const getInventoryResultsFormatterBase = () => ({
  barcode: item => item?.barcode,
  status: item => item?.status?.name ?? '',
  effectiveLocation: item => item?.effectiveLocation?.name || '',
  callNumber: item => item?.callNumber,
  hrid: item => item?.hrid,
  materialType: item => item?.materialType?.name || '',
  permanentLoanType: item => item.permanentLoanType?.name || '',
  temporaryLoanType: item => item.temporaryLoanType?.name || '',
});

export const getInventoryResultsFormatter = () => ({
  ...getInventoryResultsFormatterBase(),
  id: item => item.id,
  formerIds: item => item.formerIds?.join(','),
  accessionNumber: item => item.accessionNumber,
  permanentLocation: item => item.permanentLocation?.name || '',
  temporaryLocation: item => item.temporaryLocation?.name || '',
  copyNumber: item => item.copyNumber,
  enumeration: item => item.enumeration,
  chronology: item => item.chronology,
  volume: item => item.volume,
});

export const getHoldingsResultsFormatterBase = () => ({
  hrid: item => item.hrid,
  permanentLocation: item => item.permanentLocation,
  temporaryLocation: item => item.temporaryLocation,
  callNumberPrefix: item => item.callNumberPrefix,
  callNumber: item => item.callNumber,
  callNumberSuffix: item => item.callNumberSuffix,
  holdingsType: item => item.holdingsType,
});

export const getHoldingsResultsFormatter = () => ({
  ...getHoldingsResultsFormatterBase(),
  effectiveLocation: item => item.effectiveLocation,
  id: item => item.id,
  source: item => item.source,
  discoverySuppress: item => item.discoverySuppress?.name || '',
  callNumberType: item => item.callNumberType,
});

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
