import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import { Modal } from '@folio/stripes/components';

import { Preloader } from '@folio/stripes-data-transfer-components';
import { BulkEditPreviewModalList } from './BulkEditPreviewModalList';


export const BulkEditPreviewModal = ({
  open,
  isPreviewLoading,
  modalFooter,
  onKeepEditing,
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
      {isPreviewLoading ?
        <Preloader />
        :
        <BulkEditPreviewModalList
          onPreviewError={onKeepEditing}
        />
      }
    </Modal>
  );
};

BulkEditPreviewModal.propTypes = {
  open: PropTypes.bool,
  isPreviewLoading: PropTypes.bool,
  modalFooter: PropTypes.node,
  onKeepEditing: PropTypes.func,
};
