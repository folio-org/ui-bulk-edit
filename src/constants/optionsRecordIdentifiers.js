export const identifierOptions = {
  USER: [
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
      value: 'External IDs',
      label: 'ui-bulk-edit.list.filters.recordIdentifier.externalIDs',
    },
    {
      value: 'Usernames',
      label: 'ui-bulk-edit.list.filters.recordIdentifier.usernames',
    },
  ],
  ITEM: [
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
};

export const EDIT_CAPABILITIES = [
  {
    value: 'USER',
    label: 'ui-bulk-edit.list.filters.capabilities.users',
    disabled: false,
  },
  {
    value: 'ITEM',
    label: 'ui-bulk-edit.list.filters.capabilities.inventory',
    disabled: false,
  },
  {
    value: 'CIRCULATION',
    label: 'ui-bulk-edit.list.filters.capabilities.circulation',
    disabled: true,
  },
  {
    value: 'ACQUESTION',
    label: 'ui-bulk-edit.list.filters.capabilities.acquisition',
    disabled: true,
  },
];
