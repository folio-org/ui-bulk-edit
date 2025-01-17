import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Button } from '@folio/stripes/components';

import css from './BulkEditInAppPreviewModal.css';
import { useSearchParams } from '../../../../hooks';
import { APPROACHES, FILE_SEARCH_PARAMS } from '../../../../constants';
import {
  QUERY_KEY_DOWNLOAD_ADMINISTRATIVE_PREVIEW_MODAL,
  QUERY_KEY_DOWNLOAD_MARC_PREVIEW_MODAL,
  useFileDownload
} from '../../../../hooks/api';
import { savePreviewFile } from '../../../../utils/files';

export const BulkEditPreviewModalFooter = ({
  bulkDetails,
  buttonsDisabled,
  onKeepEditing,
  onCommitChanges,
}) => {
  const { approach } = useSearchParams();

  const { refetch: downloadCsvPreview } = useFileDownload({
    queryKey: QUERY_KEY_DOWNLOAD_ADMINISTRATIVE_PREVIEW_MODAL,
    enabled: false,
    id: bulkDetails?.id,
    fileContentType: FILE_SEARCH_PARAMS.PROPOSED_CHANGES_FILE,
    onSuccess: (fileData) => {
      savePreviewFile({
        fileName: bulkDetails?.linkToModifiedRecordsCsvFile,
        fileData,
      });
    },
  });

  const { refetch: downloadMarcPreview } = useFileDownload({
    queryKey: QUERY_KEY_DOWNLOAD_MARC_PREVIEW_MODAL,
    enabled: false,
    id: bulkDetails?.id,
    fileContentType: FILE_SEARCH_PARAMS.PROPOSED_CHANGES_MARC_FILE,
    onSuccess: (fileData) => {
      savePreviewFile({
        fileName: bulkDetails?.linkToModifiedRecordsMarcFile,
        fileData,
      });
    },
  });

  return (
    <div className={css.previewModalFooter}>
      <Button onClick={onKeepEditing}>
        <FormattedMessage id="ui-bulk-edit.previewModal.keepEditing" />
      </Button>
      <Button onClick={downloadCsvPreview} disabled={buttonsDisabled}>
        <FormattedMessage id="ui-bulk-edit.previewModal.downloadPreview" />
      </Button>
      {approach === APPROACHES.MARC && (
        <Button onClick={downloadMarcPreview} disabled={buttonsDisabled}>
          <FormattedMessage id="ui-bulk-edit.previewModal.downloadPreview.marc" />
        </Button>
      )}
      <Button onClick={onCommitChanges} buttonStyle="primary" disabled={buttonsDisabled}>
        <FormattedMessage id="ui-bulk-edit.previewModal.saveAndClose" />
      </Button>
    </div>
  );
};

BulkEditPreviewModalFooter.propTypes = {
  bulkDetails: PropTypes.object,
  buttonsDisabled: PropTypes.bool,
  onKeepEditing: PropTypes.func,
  onCommitChanges: PropTypes.func,
};
