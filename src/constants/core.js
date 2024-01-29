export const SUPPORTED_FILE_EXTENSIONS = ['csv'];

export const BULK_VISIBLE_COLUMNS = 'bulk-edit-visible-columns';

export const PREVIEW_LIMITS = {
  ERRORS: 10,
  RECORDS: 100,
};

export const APPROACHES = {
  IN_APP: 'IN_APP',
  MANUAL: 'MANUAL',
  QUERY: 'QUERY',
};

export const CAPABILITIES = {
  HOLDING: 'HOLDINGS_RECORD',
  INSTANCE: 'INSTANCE',
  ITEM: 'ITEM',
  USER: 'USER',
};

export const RECORD_TYPES = {
  ITEM: 'Items',
  USER: 'Users'
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
  ISBN: 'ISBN',
  ISSN: 'ISSN',
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
  SUPPRESS_CHECKBOX: 'SUPPRESS_CHECKBOX',
  TEXTAREA: 'TEXTAREA',
  NOTE_SELECT: 'NOTE_SELECT',
  NOTE_DUPLICATE_SELECT: 'NOTE_DUPLICATE_SELECT',
  ELECTRONIC_ACCESS_RELATIONSHIP_SELECT: 'ELECTRONIC_ACCESS_RELATIONSHIP_SELECT',
};

export const TRANSLATION_SUFFIX = {
  [CAPABILITIES.USER]: '.user',
  [CAPABILITIES.ITEM]: '.item',
  [CAPABILITIES.INSTANCE]: '.instance',
  [CAPABILITIES.HOLDING]: '.holdings',
  null: '',
  '': '',
};

export const FILTERS = {
  STATUS: 'status',
  CAPABILITY: 'entityType',
  OPERATION_TYPE: 'operationType',
  START_DATE: 'startTime',
  END_DATE: 'endTime',
  USER: 'userId',
};

export const MANUAL_UPLOAD_STEPS = {
  UPLOAD: 'UPLOAD',
  CONFIRM: 'CONFIRM',
};

export const PAGINATION_CONFIG = {
  limit: PREVIEW_LIMITS.RECORDS,
  offset: 0,
};
