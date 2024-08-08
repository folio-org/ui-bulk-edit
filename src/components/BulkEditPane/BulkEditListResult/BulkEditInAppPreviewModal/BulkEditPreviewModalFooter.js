import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { saveAs } from 'file-saver';

import { Button } from '@folio/stripes/components';

import { QUERY_KEY_DOWNLOAD_PREVIEW_MODAL, useFileDownload } from '../../../../hooks/api';
import { FILE_SEARCH_PARAMS, getFormattedFilePrefixDate } from '../../../../constants';
import { useSearchParams } from '../../../../hooks';
import css from './BulkEditInAppPreviewModal.css';


export const BulkEditPreviewModalFooter = ({
  bulkOperationId,
  isActionButtonsDisabled,
  onKeepEditing,
  onSave,
}) => {
  const {
    criteria,
    initialFileName,
  } = useSearchParams();

  const { refetch: downloadFile, isFetching: isFileDownloading } = useFileDownload({
    queryKey: QUERY_KEY_DOWNLOAD_PREVIEW_MODAL,
    enabled: false, // to prevent automatic file fetch in preview modal
    id: bulkOperationId,
    fileInfo: {
      fileContentType: FILE_SEARCH_PARAMS.PROPOSED_CHANGES_FILE,
    },
    onSuccess: fileData => {
      let fileName = initialFileName;

      if (!initialFileName) {
        fileName = `${criteria.charAt(0).toUpperCase().toUpperCase() + criteria.slice(1)}-${bulkOperationId}.csv`;
      }

      saveAs(new Blob([fileData]), `${getFormattedFilePrefixDate()}-Updates-Preview-${fileName}`);
    },
  });

  return (
    <div className={css.previewModalFooter}>
      <Button onClick={onKeepEditing}>
        <FormattedMessage id="ui-bulk-edit.previewModal.keepEditing" />
      </Button>
      <Button onClick={downloadFile} disabled={isActionButtonsDisabled || isFileDownloading}>
        <FormattedMessage id="ui-bulk-edit.previewModal.downloadPreview" />
      </Button>
      <Button onClick={onSave} buttonStyle="primary" disabled={isActionButtonsDisabled}>
        <FormattedMessage id="ui-bulk-edit.previewModal.saveAndClose" />
      </Button>
    </div>
  );
};

BulkEditPreviewModalFooter.propTypes = {
  isActionButtonsDisabled: PropTypes.bool,
  onKeepEditing: PropTypes.func,
  bulkOperationId: PropTypes.string,
  onSave: PropTypes.func,
};





