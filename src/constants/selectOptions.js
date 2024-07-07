import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  CAPABILITIES,
  IDENTIFIERS,
  JOB_STATUSES,
} from './core';

export const OPTIONS = {
  TEMPORARY_LOCATION: 'TEMPORARY_LOCATION',
  PERMANENT_LOCATION: 'PERMANENT_LOCATION',
  SUPPRESS_FROM_DISCOVERY: 'SUPPRESS_FROM_DISCOVERY',
  STAFF_SUPPRESS: 'STAFF_SUPPRESS',
  STATUS: 'STATUS',
  EXPIRATION_DATE: 'EXPIRATION_DATE',
  EMAIL_ADDRESS: 'EMAIL_ADDRESS',
  PATRON_GROUP: 'PATRON_GROUP',
  TEMPORARY_LOAN_TYPE: 'TEMPORARY_LOAN_TYPE',
  PERMANENT_LOAN_TYPE: 'PERMANENT_LOAN_TYPE',
  TEMPORARY_HOLDINGS_LOCATION: 'TEMPORARY_HOLDINGS_LOCATION',
  PERMANENT_HOLDINGS_LOCATION: 'PERMANENT_HOLDINGS_LOCATION',
  ITEM_NOTE: 'ITEM_NOTE',
  HOLDINGS_NOTE: 'HOLDINGS_NOTE',
  INSTANCE_NOTE: 'INSTANCE_NOTE',
  ADMINISTRATIVE_NOTE: 'ADMINISTRATIVE_NOTE',
  CHECK_IN_NOTE: 'CHECK_IN_NOTE',
  CHECK_OUT_NOTE: 'CHECK_OUT_NOTE',
  ELECTRONIC_ACCESS_URI: 'ELECTRONIC_ACCESS_URI',
  ELECTRONIC_ACCESS_URL_RELATIONSHIP: 'ELECTRONIC_ACCESS_URL_RELATIONSHIP',
  ELECTRONIC_ACCESS_LINK_TEXT: 'ELECTRONIC_ACCESS_LINK_TEXT',
  ELECTRONIC_ACCESS_MATERIALS_SPECIFIED: 'ELECTRONIC_ACCESS_MATERIALS_SPECIFIED',
  ELECTRONIC_ACCESS_URL_PUBLIC_NOTE: 'ELECTRONIC_ACCESS_URL_PUBLIC_NOTE',
};

export const PARAMETERS_KEYS = {
  ITEM_NOTE_TYPE_ID_KEY: 'ITEM_NOTE_TYPE_ID_KEY',
  HOLDINGS_NOTE_TYPE_ID_KEY: 'HOLDINGS_NOTE_TYPE_ID_KEY',
  INSTANCE_NOTE_TYPE_ID_KEY: 'INSTANCE_NOTE_TYPE_ID_KEY',
  APPLY_TO_HOLDINGS: 'APPLY_TO_HOLDINGS',
  APPLY_TO_ITEMS: 'APPLY_TO_ITEMS',
  STAFF_ONLY: 'STAFF_ONLY',
};

export const getItemsWithPlaceholder = (items) => [
  {
    value: '',
    label: <FormattedMessage id="ui-bulk-edit.type.placeholder" />,
    disabled: true,
  },
  ...items,
];

export const getItemsWithoutPlaceholder = (items) => items.filter(item => item.value);

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
  [CAPABILITIES.INSTANCE]: [
    {
      value: '',
      label: 'ui-bulk-edit.list.filters.recordIdentifier.placeholder',
    },
    {
      value: IDENTIFIERS.ID,
      label: 'ui-bulk-edit.list.filters.recordIdentifier.instance.instanceUUID',
    },
    {
      value: IDENTIFIERS.HRID,
      label: 'ui-bulk-edit.list.filters.recordIdentifier.instance.instanceHRID',
    },
    // It's commented in scope of story UIBULKED-437
    // {
    //   value: IDENTIFIERS.ISBN,
    //   label: 'ui-bulk-edit.list.filters.recordIdentifier.instance.instanceISBN',
    // },
    // {
    //   value: IDENTIFIERS.ISSN,
    //   label: 'ui-bulk-edit.list.filters.recordIdentifier.instance.instanceISSN',
    // },
  ],
  '': [
    {
      value: '',
      label: 'ui-bulk-edit.list.filters.recordIdentifier.placeholder',
    },
  ],
};

export const FILTER_OPTIONS = {
  STATUS: [
    JOB_STATUSES.NEW,
    JOB_STATUSES.RETRIEVING_RECORDS,
    JOB_STATUSES.SAVING_RECORDS_LOCALLY,
    JOB_STATUSES.DATA_MODIFICATION,
    JOB_STATUSES.REVIEW_CHANGES,
    JOB_STATUSES.COMPLETED,
    JOB_STATUSES.COMPLETED_WITH_ERRORS,
    JOB_STATUSES.FAILED,
  ].map(status => ({
    value: status,
    label: <FormattedMessage id={`ui-bulk-edit.logs.status.${status}`} />,
  })),
  CAPABILITY: Object.values(CAPABILITIES).map(entityType => ({
    value: entityType,
    label: <FormattedMessage id={`ui-bulk-edit.logs.entityType.${entityType}`} />,
  })),
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

export const getHoldingsOptions = (formatMessage, holdingsNotes = []) => [
  {
    value: OPTIONS.ADMINISTRATIVE_NOTE,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.administrativeNote' }),
    disabled: false,
  },
  {
    value: OPTIONS.ELECTRONIC_ACCESS_URI,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.holdings.uri' }),
    disabled: false,
    categoryName: formatMessage({ id: 'ui-bulk-edit.category.electronicAccess' }),
  },
  {
    value: OPTIONS.ELECTRONIC_ACCESS_URL_RELATIONSHIP,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.holdings.urlRelationship' }),
    disabled: false,
    categoryName: formatMessage({ id: 'ui-bulk-edit.category.electronicAccess' }),
  },
  {
    value: OPTIONS.ELECTRONIC_ACCESS_LINK_TEXT,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.holdings.linkText' }),
    disabled: false,
    categoryName: formatMessage({ id: 'ui-bulk-edit.category.electronicAccess' }),
  },
  {
    value: OPTIONS.ELECTRONIC_ACCESS_MATERIALS_SPECIFIED,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.holdings.materialsSpecified' }),
    disabled: false,
    categoryName: formatMessage({ id: 'ui-bulk-edit.category.electronicAccess' }),
  },
  {
    value: OPTIONS.ELECTRONIC_ACCESS_URL_PUBLIC_NOTE,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.holdings.urlPublic' }),
    disabled: false,
    categoryName: formatMessage({ id: 'ui-bulk-edit.category.electronicAccess' }),
  },
  {
    value: OPTIONS.PERMANENT_HOLDINGS_LOCATION,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.holdings.permanentLocation' }),
    disabled: false,
    categoryName: formatMessage({ id: 'ui-bulk-edit.category.holdingsLocation' }),
  },
  {
    value: OPTIONS.TEMPORARY_HOLDINGS_LOCATION,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.holdings.temporaryLocation' }),
    disabled: false,
    categoryName: formatMessage({ id: 'ui-bulk-edit.category.holdingsLocation' }),
  },
  ...holdingsNotes,
  {
    value: OPTIONS.SUPPRESS_FROM_DISCOVERY,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.holdings.suppress' }),
    disabled: false,
  },
];

export const getInstanceOptions = (formatMessage, instanceNotes) => [
  {
    value: OPTIONS.ADMINISTRATIVE_NOTE,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.administrativeNote' }),
    disabled: false,
  },
  {
    value: OPTIONS.STAFF_SUPPRESS,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.instances.staffSuppress' }),
    disabled: false,
  },
  {
    value: OPTIONS.SUPPRESS_FROM_DISCOVERY,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.instances.suppress' }),
    disabled: false,
  },
  ...instanceNotes
];

export const getHoldingsNotes = (formatMessage, holdingsNotes) => [
  {
    value: '',
    label: formatMessage({ id: 'ui-bulk-edit.options.placeholder' }),
    disabled: true,
  },
  {
    value: OPTIONS.ADMINISTRATIVE_NOTE,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.administrativeNote' }),
    disabled: false,
  },
  ...holdingsNotes,
];

export const getInstanceNotes = (formatMessage, instanceNotes) => [
  {
    value: '',
    label: formatMessage({ id: 'ui-bulk-edit.options.placeholder' }),
    disabled: true,
  },
  {
    value: OPTIONS.ADMINISTRATIVE_NOTE,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.administrativeNote' }),
    disabled: false,
  },
  ...instanceNotes,
];

export const getNotesOptions = (formatMessage, itemNotes) => [
  {
    value: '',
    label: formatMessage({ id: 'ui-bulk-edit.options.placeholder' }),
    disabled: true,
  },
  {
    value: OPTIONS.ADMINISTRATIVE_NOTE,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.administrativeNote' }),
    disabled: false,
  },
  {
    value: OPTIONS.CHECK_IN_NOTE,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.checkInNote' }),
    disabled: false,
  },
  {
    value: OPTIONS.CHECK_OUT_NOTE,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.checkOutNote' }),
    disabled: false,
  },
  ...itemNotes,
];

export const getDuplicateNoteOptions = (formatMessage) => [
  {
    value: OPTIONS.CHECK_IN_NOTE,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.checkInNote' }),
    disabled: false,
  },
  {
    value: OPTIONS.CHECK_OUT_NOTE,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.checkOutNote' }),
    disabled: false,
  },
];

export const getItemsOptions = (formatMessage, itemNotes = []) => [
  ...getItemsWithoutPlaceholder(getNotesOptions(formatMessage, itemNotes)),
  {
    value: OPTIONS.STATUS,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.statusLabel' }),
    disabled: false,
  },
  {
    value: OPTIONS.PERMANENT_LOAN_TYPE,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.permanentLoanType' }),
    disabled: false,
    categoryName: formatMessage({ id: 'ui-bulk-edit.category.loanType' }),
  },
  {
    value: OPTIONS.TEMPORARY_LOAN_TYPE,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.temporaryLoanTypeLabel' }),
    disabled: false,
    categoryName: formatMessage({ id: 'ui-bulk-edit.category.loanType' }),
  },
  {
    value: OPTIONS.PERMANENT_LOCATION,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.permanentLocation' }),
    disabled: false,
    categoryName: formatMessage({ id: 'ui-bulk-edit.category.location' }),
  },
  {
    value: OPTIONS.TEMPORARY_LOCATION,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.temporaryLocation' }),
    disabled: false,
    categoryName: formatMessage({ id: 'ui-bulk-edit.category.location' }),
  },
  {
    value: OPTIONS.SUPPRESS_FROM_DISCOVERY,
    label: formatMessage({ id: 'ui-bulk-edit.layer.options.suppressFromDiscovery' }),
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
    value: CAPABILITIES.HOLDING,
    label: <FormattedMessage id="ui-bulk-edit.list.filters.capabilities.holdings" />,
    disabled: false,
  },
  {
    value: CAPABILITIES.INSTANCE,
    label: <FormattedMessage id="ui-bulk-edit.list.filters.capabilities.instances" />,
    disabled: false,
  },
  {
    value: CAPABILITIES.ITEM,
    label: <FormattedMessage id="ui-bulk-edit.list.filters.capabilities.inventory" />,
    disabled: false,
  },
  {
    value: CAPABILITIES.USER,
    label: <FormattedMessage id="ui-bulk-edit.list.filters.capabilities.users" />,
    disabled: false,
  },
];
