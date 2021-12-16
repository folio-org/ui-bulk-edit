import { useState } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';

import { useJobCommand } from '../../API/useFileUpload';

import { ListFileUploader } from '../ListFileUploader';

const BulkEditStartModal = ({
  open,
  onCancel,
}) => {
  const intl = useIntl();

  const { isLoading } = useJobCommand();

  const [isDropZoneActive, setDropZoneActive] = useState(false);
  const [fileExtensionModalOpen, setFileExtensionModalOpen] = useState(false);

  const modalLabel = intl.formatMessage({ id: 'ui-bulk-edit.meta.title' });
  const confirmLabel = intl.formatMessage({ id: 'stripes-components.saveAndClose' });
  const cancelLabel = intl.formatMessage({ id: 'stripes-components.cancel' });
  const uploaderSubTitle = intl.formatMessage({ id: 'ui-bulk-edit.uploaderSubTitle.records' });

  const hideFileExtensionModal = () => {
    setFileExtensionModalOpen(false);
  };

  const handleDragEnter = () => {
    setDropZoneActive(true);
  };

  const handleDragLeave = () => {
    setDropZoneActive(false);
  };

  const onStartbulkEdit = () => {
    onCancel();
  };

  const footer = (
    <ModalFooter>
      <Button
        disabled
        onClick={onStartbulkEdit}
      >
        {confirmLabel}
      </Button>
      <Button
        onClick={onCancel}
      >
        {cancelLabel}
      </Button>
    </ModalFooter>
  );

  return (
    <Modal
      open={open}
      label={modalLabel}
      aria-label={modalLabel}
      footer={footer}
    >
      <ListFileUploader
        className="Centered"
        isLoading={isLoading}
        isDropZoneActive={isDropZoneActive}
        handleDrop={() => setDropZoneActive(false)}
        fileExtensionModalOpen={fileExtensionModalOpen}
        hideFileExtensionModal={hideFileExtensionModal}
        handleDragLeave={handleDragLeave}
        handleDragEnter={handleDragEnter}
        uploaderSubTitle={uploaderSubTitle}
      />
    </Modal>
  );
};

BulkEditStartModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default BulkEditStartModal;
