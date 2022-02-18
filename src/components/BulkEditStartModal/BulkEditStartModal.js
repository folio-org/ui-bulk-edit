import { useState } from 'react';
import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  Modal,
  ModalFooter,
  MessageBanner,
} from '@folio/stripes/components';
import { buildSearch, useShowCallout } from '@folio/stripes-acq-components';

import { useHistory, useLocation } from 'react-router-dom';
import { useJobCommand, useFileUploadComand } from '../../API/useFileUpload';

import { ListFileUploader } from '../ListFileUploader';
import { BULK_EDIT_UPDATE, BULK_EDIT_BARCODE } from '../../constants/constants';

const BulkEditStartModal = ({
  open,
  onCancel,
  setFileName,
  setIsBulkConformationModal,
  setCountOfRecords,
  setUpdatedId,
}) => {
  const history = useHistory();
  const location = useLocation();
  const intl = useIntl();
  const showCallout = useShowCallout();

  const { requestJobId, isLoading } = useJobCommand();
  const { fileUpload } = useFileUploadComand();

  const [isDropZoneActive, setDropZoneActive] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [fileExtensionModalOpen, setFileExtensionModalOpen] = useState(false);
  const [isConformationButton, setConformationButton] = useState(true);

  const fileName = new URLSearchParams(location.search).get('fileName');
  const modalLabel = intl.formatMessage({ id: 'ui-bulk-edit.meta.title' });
  const modalLabelMessage = intl.formatMessage({ id: 'ui-bulk-edit.modal.successfullMessage' }, { fileName });
  const confirmLabel = intl.formatMessage({ id: 'ui-bulk-edit.modal.next' });
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
    setFileName(fileToUpload.name);
    setDropZoneActive(false);

    try {
      const { id } = await requestJobId({ recordIdentifier: BULK_EDIT_BARCODE, editType: BULK_EDIT_UPDATE });

      const data = await fileUpload({ id, fileToUpload });

      await setUpdatedId(id);

      history.replace({
        search: buildSearch({ fileName: fileToUpload.name }),
      });

      setCountOfRecords(data);

      setIsFileUploaded(true);

      setConformationButton(false);
    } catch {
      showCallout({
        message: errorMessage,
        type: 'error',
      });
    }
  };

  const handleDrop = async (acceptedFiles) => {
    const fileToUpload = acceptedFiles[0];

    await uploadFileFlow(fileToUpload);

    setDropZoneActive(false);
  };

  const onStartbulkEdit = () => {
    onCancel();
    setIsBulkConformationModal(true);
    setConformationButton(true);
    setIsFileUploaded(false);
  };

  const footer = (
    <ModalFooter>
      <Button
        onClick={onStartbulkEdit}
        disabled={isConformationButton}
        buttonStyle="primary"
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
      {!isFileUploaded ?
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
        :
        <MessageBanner type="success">{modalLabelMessage}</MessageBanner>
      }
    </Modal>
  );
};

BulkEditStartModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  setFileName: PropTypes.func,
  setIsBulkConformationModal: PropTypes.func,
  setCountOfRecords: PropTypes.func,
  setUpdatedId: PropTypes.func,
};

export default BulkEditStartModal;
