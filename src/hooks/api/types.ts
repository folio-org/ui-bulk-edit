export type EntityCustomIdentifierType = 'ID'
| 'BARCODE'
| 'HRID'
| 'FORMER_IDS'
| 'ACCESSION_NUMBER'
| 'HOLDINGS_RECORD_ID'
| 'USER_NAME'
| 'EXTERNAL_SYSTEM_ID'
| 'INSTANCE_HRID'
| 'ITEM_BARCODE';

export type Status = 'NEW'
|'RETRIEVING_RECORDS'
|'SAVING_RECORDS_LOCALLY'
|'DATA_MODIFICATION'
|'REVIEW_CHANGES'
|'APPLY_CHANGES'
|'SUSPENDED'
|'COMPLETED'
|'COMPLETED_WITH_ERRORS'
|'CANCELLED'
|'SCHEDULED'
|'FAILED';

export type Approach = 'MANUAL' | 'IN_APP' | 'QUERY';

export type EntityType = 'USER' | 'ITEM' | 'HOLDINGS_RECORD';

export type Step = 'UPLOAD' | 'EDIT' | 'COMMIT';

export type DataTypes = 'NUMERIC' | 'DATE_TIME' | 'STRING'

export type Params = {
  id?: string,
  step?: Step,
};

export type Parameter = {
  key: string,
  value: string,
};

export type FileInfo = {
  fileContentType: string,
  fileName: string
};

export type Header = {
  value: string,
  dataType: DataTypes,
  visible: boolean,
}
export type Group ={
  desc: string,
  expirationOffsetInDays?: number,
  group: string,
  id: string
};

export type BulkOperationDto = {
  id: string,
  hrId: string,
  userId: string,
  operationType: 'UPDATE' | 'DELETE',
  entityType: EntityType,
  entityCustomIdentifierType: EntityCustomIdentifierType,
  status: Status,
  approach: Approach,
  dataExportJobId: string,
  linkToTriggeringCsvFile?: string,
  linkToMatchedRecordsJsonFile?: string,
  linkToMatchedRecordsCsvFile?: string,
  linkToMatchedRecordsErrorsCsvFile?: string,
  linkToModifiedRecordsJsonFile?: string,
  linkToModifiedRecordsCsvFile?: string,
  linkToCommittedRecordsJsonFile?: string,
  linkToCommittedRecordsCsvFile?: string,
  linkToCommittedRecordsErrorsCsvFile?: string,
  totalNumOfRecords: number,
  processedNumOfRecords: number,
  matchedNumOfRecords: number,
  committedNumOfRecords: number,
  matchedNumOfErrors: number,
  committedNumOfErrors: number,
  executionChunkSize: number,
  startTime: Date
  endTime?: Date,
  errorMessage?: string,
};

export type ErrorDto = {
  message: string,
  type: string,
  code: string,
  parameters: Parameter[],
};

export type UnifiedTableDto = {
  header: Header[],
  rows: string[]
}

export type GroupsDto = {
  usergroups: Group[],
  totalRecords: number
};

export type LoanTypesDto = {
  loantypes: {
    id: string,
    name: string
  }[]
};

