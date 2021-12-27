import { useState } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';
import { useShowCallout } from '@folio/stripes-acq-components';

import { useJobCommand, useFileUploadComand } from '../../API/useFileUpload';

import { ListFileUploader } from '../ListFileUploader';
import { BULK_EDIT_UPDATE } from '../../constants/constants';


const BulkEditStartModal = ({
  open,
  onCancel,
  setFileUploadedMatchedName,
  setIsBulkConformationModal,
}) => {
  const intl = useIntl();
  const showCallout = useShowCallout();

  const { requestJobId, isLoading } = useJobCommand();
  const { fileUpload } = useFileUploadComand();

  const [isDropZoneActive, setDropZoneActive] = useState(false);
  const [fileExtensionModalOpen, setFileExtensionModalOpen] = useState(false);

  const modalLabel = intl.formatMessage({ id: 'ui-bulk-edit.meta.title' });
  const confirmLabel = intl.formatMessage({ id: 'stripes-components.saveAndClose' });
  const cancelLabel = intl.formatMessage({ id: 'stripes-components.cancel' });
  const uploaderSubTitle = intl.formatMessage({ id: 'ui-bulk-edit.uploaderSubTitle.records' });
  const errorMessage = intl.formatMessage({ id: 'ui-bulk-edit.error.uploadedFile' });

  const hideFileExtensionModal = () => {
    setFileExtensionModalOpen(false);
  };

  const handleDragEnter = () => {
    setDropZoneActive(true);
  };

  const handleDragLeave = () => {
    setDropZoneActive(false);
  };

  const uploadFileFlow = async (fileToUpload) => {
    setFileUploadedMatchedName(fileToUpload.name);
    setDropZoneActive(false);

    try {
      const { id } = await requestJobId({ recordIdentifier: 'BARCODE', editType: BULK_EDIT_UPDATE });

      await fileUpload({ id, fileToUpload });
    } catch ({ message }) {
      showCallout({
        message: errorMessage,
        type: 'error',
      });
    }
  };

  const handleDrop = (acceptedFiles) => {
    const fileToUpload = acceptedFiles[0];

    uploadFileFlow(fileToUpload);

    setDropZoneActive(false);
  };

  const onStartbulkEdit = () => {
    onCancel();
    setIsBulkConformationModal(true);
  };

  const footer = (
    <ModalFooter>
      <Button
        disabled={false}
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
        handleDrop={handleDrop}
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
  setFileUploadedMatchedName: PropTypes.func.isRequired,
  setIsBulkConformationModal: PropTypes.func.isRequired,
};

export default BulkEditStartModal;
