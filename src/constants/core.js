export const SUPPORTED_FILE_EXTENSIONS = ['csv'];
export const BULK_EDIT_QUERY = 'BULK_EDIT_QUERY';
export const BULK_EDIT_BARCODE = 'BARCODE';
export const BULK_EDIT_UPDATE = 'BULK_EDIT_UPDATE';
export const PREVIEW_LIMITS = {
  ERRORS: 10,
  RECORDS: 10,
};

export const APPROACHES = {
  CSV: 'CSV',
  IN_APP: 'IN_APP',
};

export const CAPABILITIES = {
  ITEM: 'ITEM',
  USER: 'USER',
  HOLDING: 'HOLDING',
};

export const IDENTIFIERS = {
  ID: 'ID',
  BARCODE: 'BARCODE',
  HRID: 'HRID',
  FORMER_IDS: 'FORMER_IDS',
  ACCESSION_NUMBER: 'ACCESSION_NUMBER',
  HOLDINGS_RECORD_ID: 'HOLDINGS_RECORD_ID',
  USER_NAME: 'USER_NAME',
  EXTERNAL_SYSTEM_ID: 'EXTERNAL_SYSTEM_ID',
  INSTANCE_HRID: 'INSTANCE_HRID',
  ITEM_BARCODE: 'ITEM_BARCODE',
};

export const JOB_STATUSES = {
  NEW: 'NEW',
  RETRIEVING_RECORDS: 'RETRIEVING_RECORDS',
  SAVING_RECORDS_LOCALLY: 'SAVING_RECORDS_LOCALLY',
  DATA_MODIFICATION: 'DATA_MODIFICATION',
  REVIEW_CHANGES: 'REVIEW_CHANGES',
  APPLY_CHANGES: 'APPLY_CHANGES',
  SUSPENDED: 'SUSPENDED',
  COMPLETED: 'COMPLETED',
  COMPLETED_WITH_ERRORS: 'COMPLETED_WITH_ERRORS',
  CANCELLED: 'CANCELLED',
  SCHEDULED: 'SCHEDULED',
  FAILED: 'FAILED',
};

export const EDITING_STEPS = {
  UPLOAD: 'UPLOAD',
  EDIT: 'EDIT',
  COMMIT: 'COMMIT',
};

export const CRITERIA = {
  IDENTIFIER: 'identifier',
  QUERY: 'query',
  LOGS: 'logs',
};

export const CAPABILITIES_VALUE = {
  [CAPABILITIES.USER]: 'user',
  [CAPABILITIES.ITEM]: 'item',
  [CAPABILITIES.HOLDING]: 'holdings',
};

export const CAPABILITIES_PREVIEW = {
  [CAPABILITIES.USER]: 'users',
  [CAPABILITIES.ITEM]: 'items',
  [CAPABILITIES.HOLDING]: 'holdings',
};

export const TYPE_OF_PROGRESS = {
  INITIAL: 'initial',
  PROCESSED: 'processed',
};

export const CONTROL_TYPES = {
  PATRON_GROUP_SELECT: 'PATRON_GROUP_SELECT',
  STATUS_SELECT: 'STATUS_SELECT',
  DATE: 'DATE',
  INPUT: 'INPUT',
  LOCATION: 'LOCATION',
  LOAN_TYPE: 'LOAN_TYPE',
};

export const TRANSLATION_SUFFIX = {
  [CAPABILITIES.USER]: '',
  [CAPABILITIES.ITEM]: '.item',
  [CAPABILITIES.HOLDING]: '.holdings',
};

export const FILTERS = {
  STATUS: 'status',
  CAPABILITY: 'capability',
  OPERATION_TYPE: 'operation_type',
  START_DATE: 'start_date',
  END_DATE: 'end_date',
};
