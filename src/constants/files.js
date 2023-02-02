import { FormattedMessage } from 'react-intl';
import React from 'react';

// use as marks that files are ready
export const FILE_KEYS = {
  MATCHING_RECORDS_LINK: 'linkToMatchedRecordsCsvFile',
  MATCHING_ERRORS_LINK: 'linkToMatchedRecordsErrorsCsvFile',
  PROPOSED_CHANGES_LINK: 'linkToModifiedRecordsCsvFile',
  UPDATED_RECORDS_LINK: 'linkToCommittedRecordsCsvFile',
  UPDATED_ERRORS_LINK: 'linkToCommittedRecordsErrorsCsvFile',
};

// use as API key for /download
export const FILE_SEARCH_PARAMS = {
  MATCHED_RECORDS_FILE: 'MATCHED_RECORDS_FILE',
  RECORD_MATCHING_ERROR_FILE: 'RECORD_MATCHING_ERROR_FILE',
  COMMITTED_RECORDS_FILE: 'COMMITTED_RECORDS_FILE',
  COMMITTING_CHANGES_ERROR_FILE: 'COMMITTING_CHANGES_ERROR_FILE',
  PROPOSED_CHANGES_FILE: 'PROPOSED_CHANGES_FILE',
};

export const getDownloadLinks = (perms, date) => [
  {
    KEY: FILE_KEYS.MATCHING_RECORDS_LINK,
    SEARCH_PARAM: FILE_SEARCH_PARAMS.MATCHED_RECORDS_FILE,
    LINK_NAME: <FormattedMessage id="ui-bulk-edit.start.downloadMathcedRecords" />,
    PERMS: perms.hasAnyEditPermissions,
    SAVE_FILE_NAME: `${date}-Matched-Records.csv`,
  },
  {
    KEY: FILE_KEYS.UPDATED_RECORDS_LINK,
    SEARCH_PARAM: FILE_SEARCH_PARAMS.COMMITTED_RECORDS_FILE,
    LINK_NAME: <FormattedMessage id="ui-bulk-edit.start.downloadChangedRecords" />,
    PERMS: perms.hasAnyEditPermissions,
    SAVE_FILE_NAME: `${date}-Changed-Records.csv`,
  },
  {
    KEY: FILE_KEYS.UPDATED_ERRORS_LINK,
    SEARCH_PARAM: FILE_SEARCH_PARAMS.COMMITTING_CHANGES_ERROR_FILE,
    LINK_NAME: <FormattedMessage id="ui-bulk-edit.start.downloadErrors" />,
    PERMS: perms.hasAnyEditPermissions,
    SAVE_FILE_NAME: `${date}-Errors-bulk-ops.csv`,
  },
];
