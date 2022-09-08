import { useRef, useState } from 'react';
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
  fileName,
  setIsBulkConformationModal,
  setCountOfRecords,
  setUpdatedId,
  setFileName,
}) => {
  const history = useHistory();
  const location = useLocation();
  const intl = useIntl();
  const showCallout = useShowCallout();
  const search = new URLSearchParams(location.search);
  const controller = useRef();

  const entityType = search.get('capabilities')?.slice(0, -1);

  const { requestJobId } = useJobCommand({ entityType });
  const { fileUpload, isLoading } = useFileUploadComand();

  const [isDropZoneActive, setDropZoneActive] = useState(false);
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isConformationButton, setConformationButton] = useState(true);

  const modalLabel = intl.formatMessage({ id: 'ui-bulk-edit.meta.title.uploadedFile' }, { fileName });
  const modalLabelMessage = intl.formatMessage({ id: 'ui-bulk-edit.modal.successfullMessage' }, { fileName });
  const confirmLabel = intl.formatMessage({ id: 'ui-bulk-edit.modal.next' });
  const cancelLabel = intl.formatMessage({ id: 'stripes-components.cancel' });
  const uploaderSubTitle = intl.formatMessage({ id: 'ui-bulk-edit.uploaderSubTitle.records' });
  const errorMessage = intl.formatMessage({ id: 'ui-bulk-edit.error.uploadedFile' });

  const handleDragEnter = () => {
    setDropZoneActive(true);
  };

  const handleDragLeave = () => {
    setDropZoneActive(false);
  };

  const uploadFileFlow = async (fileToUpload) => {
    controller.current = new AbortController();
    try {
      const { id } = await requestJobId({ recordIdentifier: BULK_EDIT_BARCODE, editType: BULK_EDIT_UPDATE });

      const data = await fileUpload({ id, fileToUpload, controller: controller.current });

      await setUpdatedId(id);

      history.replace({
        search: buildSearch({ processedFileName: fileToUpload.name }, history.location.search),
      });

      setFileName(fileToUpload.name);

      setCountOfRecords(data);

      setIsFileUploaded(true);

      setConformationButton(false);
    } catch (error) {
      if (!controller.current.signal.aborted) {
        showCallout({
          message: errorMessage,
          type: 'error',
        });
      }
    }
  };

  const handleDrop = async (fileToUpload) => {
    setDropZoneActive(false);

    if (fileToUpload) {
      setFileName(fileName);
      await uploadFileFlow(fileToUpload);
    }
  };

  const handleStartBulkEdit = () => {
    onCancel();
    setIsBulkConformationModal(true);
    setConformationButton(true);
    setIsFileUploaded(false);
  };

  const handleCancel = () => {
    onCancel();
    if (controller.current) controller.current.abort();
    search.delete('processedFileName');

    const searchStr = `?${search.toString()}`;

    history.replace({
      search: buildSearch({}, searchStr),
    });

    setFileName('');
    setIsFileUploaded(false);
    setConformationButton(true);
  };

  const footer = (
    <ModalFooter>
      <Button
        onClick={handleStartBulkEdit}
        disabled={isConformationButton}
        buttonStyle="primary"
      >
        {confirmLabel}
      </Button>
      <Button
        onClick={handleCancel}
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
          handleDragLeave={handleDragLeave}
          handleDragEnter={handleDragEnter}
          uploaderSubTitle={uploaderSubTitle}
        />
        : <MessageBanner type="success">{modalLabelMessage}</MessageBanner>
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
  setFileName: PropTypes.func,
  fileName: PropTypes.string,
};

export default BulkEditStartModal;
