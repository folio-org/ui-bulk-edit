import { FormattedMessage } from 'react-intl';
import React from 'react';
import { EDITING_STEPS } from './core';

// use as API key for /download
export const FILE_SEARCH_PARAMS = {
  TRIGGERING_FILE: 'TRIGGERING_FILE',
  MATCHED_RECORDS_FILE: 'MATCHED_RECORDS_FILE',
  RECORD_MATCHING_ERROR_FILE: 'RECORD_MATCHING_ERROR_FILE',
  COMMITTED_RECORDS_FILE: 'COMMITTED_RECORDS_FILE',
  COMMITTED_RECORDS_MARC_FILE: 'COMMITTED_RECORDS_MARC_FILE',
  COMMITTING_CHANGES_ERROR_FILE: 'COMMITTING_CHANGES_ERROR_FILE',
  PROPOSED_CHANGES_FILE: 'PROPOSED_CHANGES_FILE',
  PROPOSED_CHANGES_MARC_FILE: 'PROPOSED_CHANGES_MARC_FILE',
};

// use as marks that getFileName are ready
export const FILE_KEYS = {
  TRIGGERING_FILE: 'linkToTriggeringCsvFile',
  MATCHED_RECORDS_FILE: 'linkToMatchedRecordsCsvFile',
  RECORD_MATCHING_ERROR_FILE: 'linkToMatchedRecordsErrorsCsvFile',
  COMMITTED_RECORDS_FILE: 'linkToCommittedRecordsCsvFile',
  COMMITTED_RECORDS_MARC_FILE: 'linkToCommittedRecordsMarcFile',
  COMMITTING_CHANGES_ERROR_FILE: 'linkToCommittedRecordsErrorsCsvFile',
  PROPOSED_CHANGES_FILE: 'linkToModifiedRecordsCsvFile',
  PROPOSED_CHANGES_MARC_FILE: 'linkToModifiedRecordsMarcFile',
};

export const LINK_KEYS = {
  linkToTriggeringCsvFile: FILE_SEARCH_PARAMS.TRIGGERING_FILE,
  linkToMatchedRecordsCsvFile: FILE_SEARCH_PARAMS.MATCHED_RECORDS_FILE,
  linkToMatchedRecordsErrorsCsvFile: FILE_SEARCH_PARAMS.RECORD_MATCHING_ERROR_FILE,
  linkToModifiedRecordsCsvFile: FILE_SEARCH_PARAMS.PROPOSED_CHANGES_FILE,
  linkToModifiedRecordsMarcFile: FILE_SEARCH_PARAMS.PROPOSED_CHANGES_MARC_FILE,
  linkToCommittedRecordsCsvFile: FILE_SEARCH_PARAMS.COMMITTED_RECORDS_FILE,
  linkToCommittedRecordsMarcFile: FILE_SEARCH_PARAMS.COMMITTED_RECORDS_MARC_FILE,
  linkToCommittedRecordsErrorsCsvFile: FILE_SEARCH_PARAMS.COMMITTING_CHANGES_ERROR_FILE,
  expired: 'expired',
};

export const getDownloadLinks = ({ perms, step }) => [
  {
    KEY: FILE_KEYS.MATCHED_RECORDS_FILE,
    SEARCH_PARAM: FILE_SEARCH_PARAMS.MATCHED_RECORDS_FILE,
    LINK_NAME: <FormattedMessage id="ui-bulk-edit.start.downloadMatchedRecords" />,
    IS_VISIBLE: perms.hasAnyEditPermissions && step === EDITING_STEPS.UPLOAD,
  },
  {
    KEY: FILE_KEYS.COMMITTED_RECORDS_FILE,
    SEARCH_PARAM: FILE_SEARCH_PARAMS.COMMITTED_RECORDS_FILE,
    LINK_NAME: <FormattedMessage id="ui-bulk-edit.start.downloadChangedRecords" />,
    IS_VISIBLE: perms.hasAnyEditPermissions,
  },
  {
    KEY: FILE_KEYS.COMMITTED_RECORDS_MARC_FILE,
    SEARCH_PARAM: FILE_SEARCH_PARAMS.COMMITTED_RECORDS_MARC_FILE,
    LINK_NAME: <FormattedMessage id="ui-bulk-edit.start.downloadChangedRecords.marc" />,
    IS_VISIBLE: perms.hasAnyEditPermissions,
  },
  {
    KEY: FILE_KEYS.RECORD_MATCHING_ERROR_FILE,
    SEARCH_PARAM: FILE_SEARCH_PARAMS.RECORD_MATCHING_ERROR_FILE,
    LINK_NAME: <FormattedMessage id="ui-bulk-edit.start.downloadErrors" />,
    IS_VISIBLE: perms.hasAnyEditPermissions && step === EDITING_STEPS.UPLOAD,
  },
  {
    KEY: FILE_KEYS.COMMITTING_CHANGES_ERROR_FILE,
    SEARCH_PARAM: FILE_SEARCH_PARAMS.COMMITTING_CHANGES_ERROR_FILE,
    LINK_NAME: <FormattedMessage id="ui-bulk-edit.start.downloadErrors" />,
    IS_VISIBLE: perms.hasAnyEditPermissions && step === EDITING_STEPS.COMMIT,
  },
];
