import React from 'react';
import { FormattedMessage } from 'react-intl';
import { CAPABILITIES, IDENTIFIERS } from './core';

export const OPTIONS = {
  TEMPORARY_LOCATION: 'TEMPORARY_LOCATION',
  PERMANENT_LOCATION: 'PERMANENT_LOCATION',
  STATUS: 'STATUS',
  EXPIRATION_DATE: 'EXPIRATION_DATE',
  EMAIL_ADDRESS: 'EMAIL_ADDRESS',
  PATRON_GROUP: 'PATRON_GROUP',
  TEMPORARY_LOAN_TYPE: 'TEMPORARY_LOAN_TYPE',
  PERMANENT_LOAN_TYPE: 'PERMANENT_LOAN_TYPE',
  TEMPORARY_HOLDINGS_LOCATION: 'TEMPORARY_LOCATION',
  PERMANENT_HOLDINGS_LOCATION: 'PERMANENT_LOCATION',
};

export const identifierOptions = {
  [CAPABILITIES.USER]: [
    {
      value: '',
      label: 'ui-bulk-edit.list.filters.recordIdentifier.placeholder',
    },
    {
      value: IDENTIFIERS.ID,
      label: 'ui-bulk-edit.list.filters.recordIdentifier.userUUIDs',
    },
    {
      value: IDENTIFIERS.BARCODE,
      label: 'ui-bulk-edit.list.filters.recordIdentifier.userBarcodes',
    },
    {
      value: IDENTIFIERS.EXTERNAL_SYSTEM_ID,
      label: 'ui-bulk-edit.list.filters.recordIdentifier.externalIDs',
    },
    {
      value: IDENTIFIERS.USER_NAME,
      label: 'ui-bulk-edit.list.filters.recordIdentifier.usernames',
    },
  ],
  [CAPABILITIES.ITEM]: [
    {
      value: '',
      label: 'ui-bulk-edit.list.filters.recordIdentifier.placeholder',
    },
    {
      value: IDENTIFIERS.BARCODE,
      label: 'ui-bulk-edit.list.filters.recordIdentifier.item.barcode',
    },
    {
      value: IDENTIFIERS.ID,
      label: 'ui-bulk-edit.list.filters.recordIdentifier.item.UUID',
    },
    {
      value: IDENTIFIERS.HRID,
      label: 'ui-bulk-edit.list.filters.recordIdentifier.item.ItemHRIDs',
    },
    {
      value: IDENTIFIERS.FORMER_IDS,
      label: 'ui-bulk-edit.list.filters.recordIdentifier.item.former',
    },
    {
      value: IDENTIFIERS.ACCESSION_NUMBER,
      label: 'ui-bulk-edit.list.filters.recordIdentifier.item.accession',
    },
    {
      value: IDENTIFIERS.HOLDINGS_RECORD_ID,
      label: 'ui-bulk-edit.list.filters.recordIdentifier.item.holdingsUUID',
    },
  ],
  [CAPABILITIES.HOLDING]: [
    {
      value: '',
      label: 'ui-bulk-edit.list.filters.recordIdentifier.placeholder',
    },
    {
      value: IDENTIFIERS.ID,
      label: 'ui-bulk-edit.list.filters.recordIdentifier.holdings.holdingsUUID',
    },
    {
      value: IDENTIFIERS.HRID,
      label: 'ui-bulk-edit.list.filters.recordIdentifier.holdings.holdingsHRID',
    },
    {
      value: IDENTIFIERS.INSTANCE_HRID,
      label: 'ui-bulk-edit.list.filters.recordIdentifier.holdings.instanceHRID',
    },
    {
      value: IDENTIFIERS.ITEM_BARCODE,
      label: 'ui-bulk-edit.list.filters.recordIdentifier.holdings.itemBarcodes',
    },
  ],
};

export const FILTER_OPTIONS = {
  STATUS: [
    {
      value: 'NEW',
      label: <FormattedMessage id="ui-bulk-edit.logs.filter.option.new" />,
    },
    {
      value: 'RETRIEVING_RECORDS',
      label: <FormattedMessage id="ui-bulk-edit.logs.filter.option.retrieving" />,
    },
    {
      value: 'SAVING_RECORDS_LOCALLY',
      label: <FormattedMessage id="ui-bulk-edit.logs.filter.option.saving" />,
    },
    {
      value: 'DATA_MODIFICATION',
      label: <FormattedMessage id="ui-bulk-edit.logs.filter.option.data" />,
    },
    {
      value: 'REVIEW_CHANGES',
      label: <FormattedMessage id="ui-bulk-edit.logs.filter.option.reviewing" />,
    },
    {
      value: 'COMPLETED',
      label: <FormattedMessage id="ui-bulk-edit.logs.filter.option.completed" />,
    },
    {
      value: 'COMPLETED_WITH_ERRORS',
      label: <FormattedMessage id="ui-bulk-edit.logs.filter.option.completedWithErrors" />,
    },
    {
      value: 'FAILED',
      label: <FormattedMessage id="ui-bulk-edit.logs.filter.option.failed" />,
    },
  ],
  CAPABILITY: [
    {
      value: 'HOLDING',
      label: <FormattedMessage id="ui-bulk-edit.logs.filter.option.holdings" />,
    },
    {
      value: 'ITEM',
      label: <FormattedMessage id="ui-bulk-edit.logs.filter.option.items" />,
    },
    {
      value: 'USER',
      label: <FormattedMessage id="ui-bulk-edit.logs.filter.option.users" />,
    },
  ],
  OPERATION_TYPE: [
    {
      value: 'UPDATE',
      label: <FormattedMessage id="ui-bulk-edit.logs.filter.option.edit" />,
    },
    {
      value: 'DELETE',
      label: <FormattedMessage id="ui-bulk-edit.logs.filter.option.delete" />,
    },
  ],
};

export const getUserOptions = (formatMessage) => [
  {
    value: '',
    label: formatMessage({ id: 'ui-bulk-edit.options.placeholder' }),
    disabled: true,
  },
  {
    value: OPTIONS.EMAIL_ADDRESS,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.email' }),
    disabled: false,
  },
  {
    value: OPTIONS.EXPIRATION_DATE,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.expirationDate' }),
    disabled: false,
  },
  {
    value: OPTIONS.PATRON_GROUP,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.patronGroup' }),
    disabled: false,
  },
];

export const getHoldingsOptions = (formatMessage) => [
  {
    value: '',
    label: formatMessage({ id: 'ui-bulk-edit.options.placeholder' }),
    disabled: true,
  },
  { value: OPTIONS.TEMPORARY_HOLDINGS_LOCATION,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.holdings.temporaryLocation' }),
    disabled: false },
  {
    value: OPTIONS.PERMANENT_HOLDINGS_LOCATION,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.holdings.permanentLocation' }),
    disabled: false,
  },
];

export const getItemsOptions = (formatMessage) => [
  {
    value: '',
    label: formatMessage({ id: 'ui-bulk-edit.options.placeholder' }),
    disabled: true,
  },
  {
    value: OPTIONS.TEMPORARY_LOCATION,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.temporaryLocation' }),
    disabled: false,
  },
  {
    value: OPTIONS.PERMANENT_LOCATION,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.permanentLocation' }),
    disabled: false,
  },
  {
    value: OPTIONS.STATUS,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.statusLabel' }),
    disabled: false,
  },
  {
    value: OPTIONS.TEMPORARY_LOAN_TYPE,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.temporaryLoanTypeLabel' }),
    disabled: false,
  },
  {
    value: OPTIONS.PERMANENT_LOAN_TYPE,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.permanentLoanType' }),
    disabled: false,
  },
];

export const getItemStatusOptions = (formatMessage) => [
  {
    value: '',
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.placeholder' }),
    disabled: true,
  },
  {
    value: 'Available',
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.available' }),
    disabled: false,
  },
  {
    value: 'Withdrawn',
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.withdrawn' }),
    disabled: false,
  },
  {
    value: 'Missing',
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.missing' }),
    disabled: false,
  },
  {
    value: 'In process (non-requestable)',
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.non-requestable' }),
    disabled: false,
  },
  {
    value: 'Intellectual item',
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.intellectual' }),
    disabled: false,
  },
  {
    value: 'Long missing',
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.longMissing' }),
    disabled: false,
  },
  {
    value: 'Restricted',
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.restricted' }),
    disabled: false,
  },
  {
    value: 'Unavailable',
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.unavailable' }),
    disabled: false,
  },
  {
    value: 'Unknown',
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.unknown' }),
    disabled: false,
  },
];

export const EDIT_CAPABILITIES_OPTIONS = [
  {
    value: CAPABILITIES.USER,
    label: <FormattedMessage id="ui-bulk-edit.list.filters.capabilities.users" />,
    disabled: false,
  },
  {
    value: CAPABILITIES.ITEM,
    label: <FormattedMessage id="ui-bulk-edit.list.filters.capabilities.inventory" />,
    disabled: false,
  },
  {
    value: CAPABILITIES.HOLDING,
    label: <FormattedMessage id="ui-bulk-edit.list.filters.capabilities.holdings" />,
    disabled: false,
  },
];