import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Button } from '@folio/stripes/components';

import css from './BulkEditInAppPreviewModal.css';


export const BulkEditPreviewModalFooter = ({
  onDownload,
  isActionButtonsDisabled,
  onKeepEditing,
  onSave,
}) => {
  return (
    <div className={css.previewModalFooter}>
      <Button onClick={onKeepEditing}>
        <FormattedMessage id="ui-bulk-edit.previewModal.keepEditing" />
      </Button>
      <Button onClick={onDownload} disabled={isActionButtonsDisabled}>
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
  onDownload: PropTypes.func,
  onSave: PropTypes.func,
};
