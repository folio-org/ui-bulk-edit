import { FormattedMessage } from 'react-intl';
import React from 'react';

export const LOGS_COLUMNS = [
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.logs.id" />,
    value: 'id',
    disabled: false,
    selected: false,
    sortable: true,
  },
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.logs.operationType" />,
    value: 'operationType',
    disabled: false,
    selected: false,
  },
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.logs.entityType" />,
    value: 'entityType',
    disabled: false,
    selected: false,
  },
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.logs.status" />,
    value: 'status',
    disabled: false,
    selected: false,
  },
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.logs.userId" />,
    value: 'userId',
    disabled: false,
    selected: false,
  },
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.logs.startTime" />,
    value: 'startTime',
    disabled: false,
    selected: false,
    sortable: true,
  },
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.logs.endTime" />,
    value: 'endTime',
    disabled: false,
    selected: false,
    sortable: true,
  },
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.logs.totalNumOfRecords" />,
    value: 'totalNumOfRecords',
    disabled: false,
    selected: false,
    sortable: true,
  },
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.logs.processedNumOfRecords" />,
    value: 'processedNumOfRecords',
    disabled: false,
    selected: false,
    sortable: true,
  },
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.logs.editing" />,
    value: 'editing',
    disabled: false,
    selected: false,
  },
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.logs.actions" />,
    value: 'actions',
    disabled: false,
    selected: false,
  },
];
