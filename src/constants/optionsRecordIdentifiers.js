export const identifierOptions = {
  users: [
    {
      value: '',
      label: 'ui-bulk-edit.list.filters.recordIdentifier.placeholder',
      disabled: true,
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
  inventory: [
    {
      value: '',
      label: 'ui-bulk-edit.list.filters.recordIdentifier.placeholder',
      disabled: true,
    },
    {
      value: 'ItemBarcode',
      label: 'ui-bulk-edit.list.filters.recordIdentifier.item.barcode',
    },
    {
      value: 'ItemUUID',
      label: 'ui-bulk-edit.list.filters.recordIdentifier.item.UUID',
    },
    {
      value: 'ItemHRIDs',
      label: 'ui-bulk-edit.list.filters.recordIdentifier.item.ItemHRIDs',
    },
    {
      value: 'ItemformerIdentifier',
      label: 'ui-bulk-edit.list.filters.recordIdentifier.item.former',
    },
    {
      value: 'ItemAccessionNumber',
      label: 'ui-bulk-edit.list.filters.recordIdentifier.item.accession',
    },
    {
      value: 'HoldingsUUIDs',
      label: 'ui-bulk-edit.list.filters.recordIdentifier.item.holdingsUUID',
    },
  ],
};

export const EDIT_CAPABILITIES = [
  {
    value: 'users',
    label: 'ui-bulk-edit.list.filters.capabilities.users',
    disabled: false,
  },
  {
    value: 'inventory',
    label: 'ui-bulk-edit.list.filters.capabilities.inventory',
    disabled: false,
  },
  {
    value: 'circulation',
    label: 'ui-bulk-edit.list.filters.capabilities.circulation',
    disabled: true,
  },
  {
    value: 'acquisition',
    label: 'ui-bulk-edit.list.filters.capabilities.acquisition',
    disabled: true,
  },
];
