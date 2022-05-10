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
import { useJobCommand, useFileUploadComand } from '../../API';

import { ListFileUploader } from '../ListFileUploader';
import { BULK_EDIT_UPDATE, BULK_EDIT_BARCODE } from '../../constants';

const BulkEditStartModal = ({
  open,
  onCancel,
  setIsBulkConformationModal,
  setCountOfRecords,
  setUpdatedId,
}) => {
  const history = useHistory();
  const location = useLocation();
  const intl = useIntl();
  const showCallout = useShowCallout();
  const entityType = new URLSearchParams(location.search).get('capabilities')?.slice(0, -1);

  const { requestJobId, isLoading } = useJobCommand({ entityType });
  const { fileUpload } = useFileUploadComand();

  const [isDropZoneActive, setDropZoneActive] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [fileExtensionModalOpen, setFileExtensionModalOpen] = useState(false);
  const [isConformationButton, setConformationButton] = useState(true);

  const fileName = new URLSearchParams(location.search).get('processedFileName');
  const modalLabel = intl.formatMessage({ id: 'ui-bulk-edit.meta.title.uploadedFile' }, { fileName });
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
    setDropZoneActive(false);

    try {
      const { id } = await requestJobId({ recordIdentifier: BULK_EDIT_BARCODE, editType: BULK_EDIT_UPDATE });

      const data = await fileUpload({ id, fileToUpload });

      await setUpdatedId(id);

      history.replace({
        search: buildSearch({ processedFileName: fileToUpload.name }, history.location.search),
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

  const onStartBulkEdit = () => {
    onCancel();
    setIsBulkConformationModal(true);
    setConformationButton(true);
    setIsFileUploaded(false);
  };

  const onCancelHandlde = () => {
    onCancel();
    setIsFileUploaded(false);
    setConformationButton(true);
  };

  const footer = (
    <ModalFooter>
      <Button
        onClick={onStartBulkEdit}
        disabled={isConformationButton}
        buttonStyle="primary"
      >
        {confirmLabel}
      </Button>
      <Button
        onClick={onCancelHandlde}
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
  setIsBulkConformationModal: PropTypes.func,
  setCountOfRecords: PropTypes.func,
  setUpdatedId: PropTypes.func,
};

export default BulkEditStartModal;
