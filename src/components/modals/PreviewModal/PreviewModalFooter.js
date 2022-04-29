import { Button } from '@folio/stripes/components';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Preloader } from '@folio/stripes-data-transfer-components';
import React, { memo } from 'react';
import css from './PreviewModal.css';

export const PreviewModalFooter = memo(({ onKeepEditing, onDownloadPreview, onSave, isDownloading }) => {
  return (
    <div className={css.previewModalFooter}>
      <Button onClick={onKeepEditing}>
        <FormattedMessage id="ui-bulk-edit.previewModal.keepEditing" />
      </Button>
      {isDownloading ? <Preloader /> : (
        <Button onClick={onDownloadPreview}>
          <FormattedMessage id="ui-bulk-edit.previewModal.downloadPreview" />
        </Button>
      )}
      <Button onClick={onSave} buttonStyle="primary">
        <FormattedMessage id="ui-bulk-edit.previewModal.saveAndClose" />
      </Button>
    </div>
  );
});

PreviewModalFooter.propTypes = {
  isDownloading: PropTypes.bool,
  onKeepEditing: PropTypes.func,
  onDownloadPreview: PropTypes.func,
  onSave: PropTypes.func,
};





