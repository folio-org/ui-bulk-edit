import { useState, useEffect } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { IfPermission } from '@folio/stripes/core';

import {
  Button,
  Modal,
  ModalFooter,
} from '@folio/stripes/components';
import { useShowCallout } from '@folio/stripes-acq-components';

import { useJobCommand, useFileUploadComand } from '../../API/useFileUpload';

import { ListFileUploader } from '../ListFileUploader';

const BulkEditStartModal = ({
  open,
  onCancel,
}) => {
  const intl = useIntl();
  const showCallout = useShowCallout();

  const { isLoading } = useJobCommand();
  const { fileUpload } = useFileUploadComand();

  const [isDropZoneActive, setDropZoneActive] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isDropZoneDisabled, setIsDropZoneDisabled] = useState(true);
  const [fileExtensionModalOpen, setFileExtensionModalOpen] = useState(false);


  const modalLabel = intl.formatMessage({ id: 'ui-bulk-edit.meta.title' });
  const confirmLabel = intl.formatMessage({ id: 'stripes-components.saveAndClose' });
  const cancelLabel = intl.formatMessage({ id: 'stripes-components.cancel' });
  const uploderSubTitle = intl.formatMessage({ id: 'ui-bulk-edit.uploaderSubTitle.records' });

  useEffect(() => {
    if (isFileUploaded) {
      setIsDropZoneDisabled(true);
    } else setIsDropZoneDisabled(false);
  }, [isFileUploaded]);

  const showFileExtensionModal = () => {
    setFileExtensionModalOpen(true);
  };

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
    setDropZoneActive(false);

    try {
      // const { id } = await requestJobId({ recordIdentifier });

      await fileUpload({ id, fileToUpload });

      // history.replace({
      //   pathname: `/bulk-edit/${id}`,
      //   search: buildSearch({ fileName: fileToUpload.name }, location.search),
      // });

      setIsFileUploaded(true);
    } catch ({ message }) {
      showCallout({ message: <FormattedMessage id="ui-bulk-edit.error.uploadedFile" /> });
    }
  };

  const handleDrop = async (acceptedFiles) => {
    const fileToUpload = acceptedFiles[0];
    const { isTypeSupported } = getFileInfo(fileToUpload);

    if (isTypeSupported) {
      await uploadFileFlow(fileToUpload);
    } else {
      showFileExtensionModal();
    }
  };

  const footer = (
    <ModalFooter>
      <Button
        disabled
        onClick={() => {}}
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
        isDropZoneDisabled={isDropZoneDisabled}
        recordIdentifier="ID"
        handleDragLeave={handleDragLeave}
        handleDragEnter={handleDragEnter}
        uploderSubTitle={uploderSubTitle}
      />
    </Modal>
  );
};

BulkEditStartModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  // onDelete: PropTypes.func.isRequired,
};

export default BulkEditStartModal;
