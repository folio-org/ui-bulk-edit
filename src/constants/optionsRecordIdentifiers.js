import { FormattedMessage } from 'react-intl';
import React from 'react';

export const identifierOptions = {
  USERS: [
    {
      value: '',
      label: 'ui-bulk-edit.list.filters.recordIdentifier.placeholder',
    },
    {
      value: 'ID',
      label: 'ui-bulk-edit.list.filters.recordIdentifier.userUUIDs',
    },
    {
      value: 'BARCODE',
      label: 'ui-bulk-edit.list.filters.recordIdentifier.userBarcodes',
    },
    {
      value: 'EXTERNAL_SYSTEM_ID',
      label: 'ui-bulk-edit.list.filters.recordIdentifier.externalIDs',
    },
    {
      value: 'USER_NAME',
      label: 'ui-bulk-edit.list.filters.recordIdentifier.usernames',
    },
  ],
  ITEMS: [
    {
      value: '',
      label: 'ui-bulk-edit.list.filters.recordIdentifier.placeholder',
    },
    {
      value: 'BARCODE',
      label: 'ui-bulk-edit.list.filters.recordIdentifier.item.barcode',
    },
    {
      value: 'ID',
      label: 'ui-bulk-edit.list.filters.recordIdentifier.item.UUID',
    },
    {
      value: 'HRID',
      label: 'ui-bulk-edit.list.filters.recordIdentifier.item.ItemHRIDs',
    },
    {
      value: 'FORMER_IDS',
      label: 'ui-bulk-edit.list.filters.recordIdentifier.item.former',
    },
    {
      value: 'ACCESSION_NUMBER',
      label: 'ui-bulk-edit.list.filters.recordIdentifier.item.accession',
    },
    {
      value: 'HOLDINGS_RECORD_ID',
      label: 'ui-bulk-edit.list.filters.recordIdentifier.item.holdingsUUID',
    },
  ],
  HOLDINGS_RECORD: [
    {
      value: '',
      label: 'ui-bulk-edit.list.filters.recordIdentifier.placeholder',
    },
    {
      value: 'ID',
      label: 'ui-bulk-edit.list.filters.recordIdentifier.holdings.holdingsUUID',
    },
    {
      value: 'HOLDINGS_RECORD_ID',
      label: 'ui-bulk-edit.list.filters.recordIdentifier.holdings.holdingsHRID',
    },
    {
      value: 'INSTANCE_HRID',
      label: 'ui-bulk-edit.list.filters.recordIdentifier.holdings.instanceHRID',
    },
    {
      value: 'ITEM_BARCODE',
      label: 'ui-bulk-edit.list.filters.recordIdentifier.holdings.itemBarcodes',
    },
  ],
};

export const EDIT_CAPABILITIES = [
  {
    value: 'USERS',
    label: <FormattedMessage id="ui-bulk-edit.list.filters.capabilities.users" />,
    disabled: false,
  },
  {
    value: 'ITEMS',
    label: <FormattedMessage id="ui-bulk-edit.list.filters.capabilities.inventory" />,
    disabled: false,
  },
  {
    value: 'HOLDINGS_RECORD',
    label: <FormattedMessage id="ui-bulk-edit.list.filters.capabilities.holdings" />,
    disabled: false,
  },
  // Commented in scope of story UIBULKED-68//
  // {
  //   value: 'CIRCULATION',
  //   label: <FormattedMessage id="ui-bulk-edit.list.filters.capabilities.circulation" />,
  //   disabled: true,
  // },
  // {
  //   value: 'ACQUESTION',
  //   label: <FormattedMessage id="ui-bulk-edit.list.filters.capabilities.acquisition" />,
  //   disabled: true,
  // },
];
