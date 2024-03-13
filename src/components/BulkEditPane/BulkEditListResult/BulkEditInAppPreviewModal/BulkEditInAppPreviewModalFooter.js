import { Button } from '@folio/stripes/components';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import React, { memo } from 'react';
import css from './BulkEditInAppPreviewModal.css';

export const BulkEditInAppPreviewModalFooter = ({
  onKeepEditing,
  onDownloadPreview,
  onSave,
  isChangedPreviewReady,
}) => {
  return (
    <div className={css.previewModalFooter}>
      <Button onClick={onKeepEditing}>
        <FormattedMessage id="ui-bulk-edit.previewModal.keepEditing" />
      </Button>
      <Button onClick={onDownloadPreview} disabled={!isChangedPreviewReady}>
        <FormattedMessage id="ui-bulk-edit.previewModal.downloadPreview" />
      </Button>
      <Button onClick={onSave} buttonStyle="primary" disabled={!isChangedPreviewReady}>
        <FormattedMessage id="ui-bulk-edit.previewModal.saveAndClose" />
      </Button>
    </div>
  );
};

BulkEditInAppPreviewModalFooter.propTypes = {
  isChangedPreviewReady: PropTypes.bool,
  onKeepEditing: PropTypes.func,
  onDownloadPreview: PropTypes.func,
  onSave: PropTypes.func,
};

export default memo(BulkEditInAppPreviewModalFooter);





