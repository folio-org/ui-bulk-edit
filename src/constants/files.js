import { FormattedMessage } from 'react-intl';
import React from 'react';
import { EDITING_STEPS } from './core';

// use as marks that getFileName are ready
export const FILE_KEYS = {
  MATCHING_RECORDS_LINK: 'linkToMatchedRecordsCsvFile',
  MATCHING_ERRORS_LINK: 'linkToMatchedRecordsErrorsCsvFile',
  PROPOSED_CHANGES_LINK: 'linkToModifiedRecordsCsvFile',
  UPDATED_RECORDS_LINK: 'linkToCommittedRecordsCsvFile',
  UPDATED_ERRORS_LINK: 'linkToCommittedRecordsErrorsCsvFile',
  TRIGGERING_FILE: 'linkToTriggeringCsvFile',
};

// use as API key for /download
export const FILE_SEARCH_PARAMS = {
  MATCHED_RECORDS_FILE: 'MATCHED_RECORDS_FILE',
  RECORD_MATCHING_ERROR_FILE: 'RECORD_MATCHING_ERROR_FILE',
  COMMITTED_RECORDS_FILE: 'COMMITTED_RECORDS_FILE',
  COMMITTING_CHANGES_ERROR_FILE: 'COMMITTING_CHANGES_ERROR_FILE',
  PROPOSED_CHANGES_FILE: 'PROPOSED_CHANGES_FILE',
};

export const FILE_TO_LINK = {
  MATCHED_RECORDS_FILE: 'linkToMatchedRecordsCsvFile',
  RECORD_MATCHING_ERROR_FILE: 'linkToMatchedRecordsErrorsCsvFile',
  COMMITTED_RECORDS_FILE: 'linkToCommittedRecordsCsvFile',
  COMMITTING_CHANGES_ERROR_FILE: 'linkToCommittedRecordsErrorsCsvFile',
  PROPOSED_CHANGES_FILE: 'linkToModifiedRecordsCsvFile',
};

export const getDownloadLinks = ({ perms, step }) => [
  {
    KEY: FILE_KEYS.MATCHING_RECORDS_LINK,
    SEARCH_PARAM: FILE_SEARCH_PARAMS.MATCHED_RECORDS_FILE,
    LINK_NAME: <FormattedMessage id="ui-bulk-edit.start.downloadMathcedRecords" />,
    IS_VISIBLE: perms.hasAnyEditPermissions && step === EDITING_STEPS.UPLOAD,
  },
  {
    KEY: FILE_KEYS.UPDATED_RECORDS_LINK,
    SEARCH_PARAM: FILE_SEARCH_PARAMS.COMMITTED_RECORDS_FILE,
    LINK_NAME: <FormattedMessage id="ui-bulk-edit.start.downloadChangedRecords" />,
    IS_VISIBLE: perms.hasAnyEditPermissions,
  },
  {
    KEY: FILE_KEYS.MATCHING_ERRORS_LINK,
    SEARCH_PARAM: FILE_SEARCH_PARAMS.RECORD_MATCHING_ERROR_FILE,
    LINK_NAME: <FormattedMessage id="ui-bulk-edit.start.downloadErrors" />,
    IS_VISIBLE: perms.hasAnyEditPermissions && step === EDITING_STEPS.UPLOAD,
  },
  {
    KEY: FILE_KEYS.UPDATED_ERRORS_LINK,
    SEARCH_PARAM: FILE_SEARCH_PARAMS.COMMITTING_CHANGES_ERROR_FILE,
    LINK_NAME: <FormattedMessage id="ui-bulk-edit.start.downloadErrors" />,
    IS_VISIBLE: perms.hasAnyEditPermissions && step === EDITING_STEPS.COMMIT,
  },
];
