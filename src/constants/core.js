export const SUPPORTED_FILE_EXTENSIONS = ['csv'];

export const BULK_VISIBLE_COLUMNS = 'bulk-edit-visible-columns';

export const PREVIEW_LIMITS = {
  ERRORS: 10,
  RECORDS: 100,
};

export const ERROR_TYPES = {
  WARNING: 'WARNING',
  ERROR: 'ERROR',
};

export const APPROACHES = {
  IN_APP: 'IN_APP',
  MANUAL: 'MANUAL',
  QUERY: 'QUERY',
  MARC: 'MARC',
};

export const CAPABILITIES = {
  HOLDING: 'HOLDINGS_RECORD',
  INSTANCE: 'INSTANCE',
  INSTANCE_MARC: 'INSTANCE_MARC',
  ITEM: 'ITEM',
  USER: 'USER',
};

export const RECORD_TYPES_META = {
  [CAPABILITIES.ITEM]: {
    id: 'd0213d22-32cf-490f-9196-d81c3c66e53f',
    labelKey: 'ui-bulk-edit.entityType.composite_item_details',
  },
  [CAPABILITIES.INSTANCE]: {
    id: '6b08439b-4f8e-4468-8046-ea620f5cfb74',
    labelKey: 'ui-bulk-edit.entityType.composite_instances',
  },
  [CAPABILITIES.HOLDING]: {
    id: '8418e512-feac-4a6a-a56d-9006aab31e33',
    labelKey: 'ui-bulk-edit.entityType.simple_holdings_record',
  },
  [CAPABILITIES.USER]: {
    id: 'ddc93926-d15a-4a45-9d9c-93eadc3d9bbf',
    labelKey: 'ui-bulk-edit.entityType.composite_user_details',
  },
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
  REVIEWED_NO_MARC_RECORDS: 'REVIEWED_NO_MARC_RECORDS',
  APPLY_CHANGES: 'APPLY_CHANGES',
  APPLY_MARC_CHANGES: 'APPLY_MARC_CHANGES',
  SUSPENDED: 'SUSPENDED',
  COMPLETED: 'COMPLETED',
  COMPLETED_WITH_ERRORS: 'COMPLETED_WITH_ERRORS',
  CANCELLED: 'CANCELLED',
  SCHEDULED: 'SCHEDULED',
  FAILED: 'FAILED',
  DATA_MODIFICATION_IN_PROGRESS: 'DATA_MODIFICATION_IN_PROGRESS',
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

export const ERRORS = {
  TOKEN: 'Incorrect number of tokens found in record'
};

export const TYPE_OF_PROGRESS = {
  INITIAL: 'initial',
  PROCESSED: 'processed',
};

export const CONTROL_TYPES = {
  PATRON_GROUP_SELECT: 'PATRON_GROUP_SELECT',
  STATUS_SELECT: 'STATUS_SELECT',
  DATE: 'DATE',
  SELECT_MENU: 'SELECT_MENU',
  EMPTY: 'EMPTY',
  ARRAY: 'ARRAY',
  INPUT: 'INPUT',
  LOCATION: 'LOCATION',
  LOAN_TYPE: 'LOAN_TYPE',
  SUPPRESS_CHECKBOX: 'SUPPRESS_CHECKBOX',
  TEXTAREA: 'TEXTAREA',
  ACTION: 'ACTION',
  SELECTION: 'SELECTION',
  CHECKBOX: 'CHECKBOX',
  PARAMETERS: 'PARAMETERS',
  NOTE_SELECT: 'NOTE_SELECT',
  NOTE_DUPLICATE_SELECT: 'NOTE_DUPLICATE_SELECT',
  ELECTRONIC_ACCESS_RELATIONSHIP_SELECT: 'ELECTRONIC_ACCESS_RELATIONSHIP_SELECT',
  STATISTICAL_CODES_SELECT: 'STATISTICAL_CODES_SELECT',
};

export const TRANSLATION_SUFFIX = {
  [CAPABILITIES.USER]: '.user',
  [CAPABILITIES.ITEM]: '.item',
  [CAPABILITIES.INSTANCE]: '.instance',
  [CAPABILITIES.HOLDING]: '.holdings',
  null: '',
  '': '',
};

export const IDENTIFIER_FILTERS = {
  CAPABILITIES: 'capabilities',
  IDENTIFIER: 'identifier',
};

export const QUERY_FILTERS = {
  RECORD_TYPE: 'queryRecordType',
};

export const LOGS_FILTERS = {
  STATUS: 'status',
  CAPABILITY: 'entityType',
  OPERATION_TYPE: 'operationType',
  START_DATE: 'startTime',
  END_DATE: 'endTime',
  USER: 'userId',
};

export const LOGS_FILTER_DEPENDENCY_MAP = {
  [CAPABILITIES.INSTANCE]: CAPABILITIES.INSTANCE_MARC,
  [JOB_STATUSES.REVIEW_CHANGES]: JOB_STATUSES.REVIEWED_NO_MARC_RECORDS,
  [JOB_STATUSES.DATA_MODIFICATION]: JOB_STATUSES.DATA_MODIFICATION_IN_PROGRESS,
};

export const MANUAL_UPLOAD_STEPS = {
  UPLOAD: 'UPLOAD',
  CONFIRM: 'CONFIRM',
};

export const PAGINATION_CONFIG = {
  limit: PREVIEW_LIMITS.RECORDS,
  offset: 0,
};

export const ERRORS_PAGINATION_CONFIG = {
  limit: PREVIEW_LIMITS.ERRORS,
  offset: 0,
};

export const ERROR_PARAMETERS_KEYS = {
  IDENTIFIER: 'IDENTIFIER',
  LINK: 'LINK',
};

export const RECORD_TYPES_MAPPING = {
  [CAPABILITIES.HOLDING]: 'holdings',
  [CAPABILITIES.INSTANCE]: 'instance',
  [CAPABILITIES.ITEM]: 'item',
  [CAPABILITIES.USER]: 'user',
};

export const RECORD_TYPES_PROFILES_MAPPING = {
  [CAPABILITIES.HOLDING]: 'holdings',
  [CAPABILITIES.INSTANCE]: 'FOLIO instances',
  [CAPABILITIES.INSTANCE_MARC]: 'instances with source MARC',
  [CAPABILITIES.ITEM]: 'items',
  [CAPABILITIES.USER]: 'users',
};
