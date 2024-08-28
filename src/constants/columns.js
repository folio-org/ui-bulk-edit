import { FormattedMessage } from 'react-intl';
import React from 'react';

export const LOGS_COLUMNS = [
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.logs.entityType" />,
    value: 'entityType',
    disabled: false,
    selected: false,
    sortable: true,
  },
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.logs.status" />,
    value: 'status',
    disabled: false,
    selected: false,
    sortable: true,
  },
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.logs.approach" />,
    value: 'approach',
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
    label: <FormattedMessage id="ui-bulk-edit.columns.logs.userId" />,
    value: 'userId',
    disabled: false,
    selected: false,
    sortable: true,
  },
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.logs.hrId" />,
    value: 'hrId',
    disabled: false,
    selected: false,
    sortable: true,
  },
  {
    label: <FormattedMessage id="ui-bulk-edit.columns.logs.actions" />,
    value: 'actions',
    disabled: false,
    selected: false,
  },
];

export const CUSTOM_ENTITY_COLUMNS = {
  USER_STATUS: 'Active',
  EXPIRATION_DATE: 'Expiration date',
  DATE_OF_BIRTH: 'Date Of Birth',
  ELECTRONIC_ACCESS: 'Electronic access',
  CATALOGED_DATE: 'Cataloged date',
  MISSING_PIECES_DATE: 'Missing pieces date',
  ITEM_DAMAGE_STATUS_DATE: 'Item damaged status date',
};
