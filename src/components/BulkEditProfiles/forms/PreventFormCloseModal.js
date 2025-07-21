import React from 'react';
import { FormattedMessage } from 'react-intl';

import { Button, Modal } from '@folio/stripes/components';

import css from '../../BulkEditPane/BulkEditListResult/BulkEditInAppPreviewModal/BulkEditInAppPreviewModal.css';


export const PreventFormCloseModal = ({ open, onKeepEditing, onClose }) => {
  const modalFooter = (
    <div className={css.previewModalFooter}>
      <Button onClick={onClose}>
        <FormattedMessage id="ui-bulk-edit.previewModal.closeWithoutSaving" />
      </Button>
      <Button onClick={onKeepEditing} buttonStyle="primary">
        <FormattedMessage id="ui-bulk-edit.previewModal.keepEditing" />
      </Button>
    </div>
  );

  return (
    <Modal
      size="small"
      open={open}
      label={<FormattedMessage id="ui-bulk-edit.previewModal.areYouSure" />}
      aria-label="PreviewModal"
      footer={modalFooter}
      dismissible
      onClose={onKeepEditing}
    >
      <FormattedMessage id="ui-bulk-edit.previewModal.unsavedChanges" />
    </Modal>
  );
};
