import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Modal } from '@folio/stripes/components';

import { Preloader } from '@folio/stripes-data-transfer-components';
import { BulkEditPreviewModalList } from './BulkEditPreviewModalList';


export const BulkEditPreviewModal = ({
  open,
  isJobPreparing,
  modalFooter,
  onKeepEditing,
  isPreviewSettled,
  onPreviewSettled,
}) => {
  return (
    <Modal
      size="large"
      open={open}
      label={<FormattedMessage id="ui-bulk-edit.previewModal.areYouSure" />}
      aria-label="PreviewModal"
      footer={modalFooter}
      dismissible
      onClose={onKeepEditing}
    >
      {isJobPreparing ?
        <Preloader />
        :
        <BulkEditPreviewModalList
          onPreviewError={onKeepEditing}
          onPreviewSettled={onPreviewSettled}
          isPreviewSettled={isPreviewSettled}
        />
      }
    </Modal>
  );
};

BulkEditPreviewModal.propTypes = {
  open: PropTypes.bool,
  isJobPreparing: PropTypes.bool,
  modalFooter: PropTypes.node,
  isPreviewSettled: PropTypes.bool,
  onKeepEditing: PropTypes.func,
  onPreviewSettled: PropTypes.func,
};
