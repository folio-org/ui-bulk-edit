import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Button } from '@folio/stripes/components';

import css from './BulkEditInAppPreviewModal.css';


export const BulkEditPreviewModalFooter = ({
  onDownload,
  downloadLabel,
  isCommitBtnDisabled,
  isDownloadBtnDisabled,
  onKeepEditing,
  onSave,
}) => {
  return (
    <div className={css.previewModalFooter}>
      <Button onClick={onKeepEditing}>
        <FormattedMessage id="ui-bulk-edit.previewModal.keepEditing" />
      </Button>
      <Button onClick={onDownload} disabled={isDownloadBtnDisabled}>
        {downloadLabel}
      </Button>
      <Button onClick={onSave} buttonStyle="primary" disabled={isCommitBtnDisabled}>
        <FormattedMessage id="ui-bulk-edit.previewModal.saveAndClose" />
      </Button>
    </div>
  );
};

BulkEditPreviewModalFooter.propTypes = {
  isDownloadBtnDisabled: PropTypes.bool,
  isCommitBtnDisabled: PropTypes.bool,
  downloadLabel: PropTypes.node,
  onKeepEditing: PropTypes.func,
  onDownload: PropTypes.func,
  onSave: PropTypes.func,
};
