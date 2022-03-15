
export const identifierOptions = [
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
];

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
