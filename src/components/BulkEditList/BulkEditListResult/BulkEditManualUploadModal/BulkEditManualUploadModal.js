import { useRef, useState } from 'react';
import { useIntl } from 'react-intl';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

import {
  Button,
  Modal,
  ModalFooter,
  MessageBanner,
} from '@folio/stripes/components';
import { buildSearch, useShowCallout } from '@folio/stripes-acq-components';

import { ListFileUploader } from '../../../ListFileUploader';
import { APPROACHES, CAPABILITIES, EDITING_STEPS, IDENTIFIERS, MANUAL_UPLOAD_STEPS } from '../../../../constants';
import {
  useUpload,
  useBulkOperationStart,
} from '../../../../hooks/api';

const BulkEditManualUploadModal = ({
  operationId,
  identifier,
  open,
  onCancel,
  setCountOfRecords,
  countOfRecords,
}) => {
  const history = useHistory();
  const intl = useIntl();
  const callout = useShowCallout();
  const controller = useRef(null);

  const { fileUpload, isLoading } = useUpload();
  const { bulkOperationStart } = useBulkOperationStart();

  const [isDropZoneActive, setDropZoneActive] = useState(false);

  const [fileName, setFileName] = useState('');
  const [currentStep, setCurrentStep] = useState(MANUAL_UPLOAD_STEPS.UPLOAD);
  const isDefaultStep = currentStep === MANUAL_UPLOAD_STEPS.UPLOAD;

  const modalLabelMessage = intl.formatMessage({ id: 'ui-bulk-edit.modal.successfullMessage' }, { fileName });
  const cancelLabel = intl.formatMessage({ id: 'stripes-components.cancel' });
  const uploaderSubTitle = intl.formatMessage({ id: 'ui-bulk-edit.uploaderSubTitle.records' });
  const uploadErrorMessage = intl.formatMessage({ id: 'ui-bulk-edit.error.uploadedFile' });
  const swwErrorMessage = intl.formatMessage({ id: 'ui-bulk-edit.error.sww' });

  const modalLabel = isDefaultStep
    ? intl.formatMessage({ id: 'ui-bulk-edit.meta.title.uploadedFile' }, { fileName })
    : intl.formatMessage({ id: 'ui-bulk-edit.meta.title.conformationModal' }, { fileName });

  const confirmLabel = isDefaultStep
    ? intl.formatMessage({ id: 'ui-bulk-edit.modal.next' })
    : intl.formatMessage({ id: 'ui-bulk-edit.conformationModal.commitChanges' });

  const confirmationModalMessage = intl.formatMessage({ id: 'ui-bulk-edit.conformationModal.message' }, { count: countOfRecords });

  const swwCallout = (message) => (
    callout({
      type: 'error',
      message,
    })
  );

  const handleDragEnter = () => {
    setDropZoneActive(true);
  };

  const handleDragLeave = () => {
    setDropZoneActive(false);
  };

  const handleNextClick = () => {
    setCurrentStep(MANUAL_UPLOAD_STEPS.CONFIRM);
  };

  const handleCancel = () => {
    if (controller.current) controller.current.abort();

    setCurrentStep(MANUAL_UPLOAD_STEPS.UPLOAD);
    setFileName('');

    onCancel();
  };

  const handleCommitChanges = async () => {
    try {
      const { committedNumOfRecords } = await bulkOperationStart({
        id: operationId,
        step: EDITING_STEPS.COMMIT,
        approach: APPROACHES.MANUAL,
      });

      setCountOfRecords(committedNumOfRecords);

      history.replace({
        pathname: `/bulk-edit/${operationId}/progress`,
        search: buildSearch({ fileName, step: EDITING_STEPS.COMMIT }, history.location.search),
      });
    } catch {
      swwCallout(swwErrorMessage);
    } finally {
      handleCancel();
    }
  };

  const uploadFileFlow = async (fileToUpload) => {
    controller.current = new AbortController();

    try {
      await fileUpload({
        operationId,
        fileToUpload,
        entityType: CAPABILITIES.USER,
        identifierType: identifier,
        manual: true,
      });

      const { matchedNumOfRecords } = await bulkOperationStart({
        id: operationId,
        step: EDITING_STEPS.EDIT,
        approach: APPROACHES.MANUAL,
      });

      setFileName(fileToUpload.name);
      setCountOfRecords(matchedNumOfRecords);
    } catch (error) {
      if (error.name !== 'AbortError') {
        swwCallout(uploadErrorMessage);
      }
    }
  };

  const handleDrop = async (fileToUpload) => {
    setDropZoneActive(false);

    if (fileToUpload) {
      await uploadFileFlow(fileToUpload);
    }
  };

  const renderFooter = () => (
    <ModalFooter>
      {isDefaultStep ? (
        <Button
          onClick={handleNextClick}
          disabled={!fileName}
          buttonStyle="primary"
        >
          {confirmLabel}
        </Button>
      ) : (
        <Button
          buttonStyle="primary"
          onClick={handleCommitChanges}
        >
          {confirmLabel}
        </Button>
      )}

      <Button
        onClick={handleCancel}
      >
        {cancelLabel}
      </Button>
    </ModalFooter>
  );

  const renderUploadContent = () => {
    return fileName
      ? <MessageBanner type="success">{modalLabelMessage}</MessageBanner>
      : (
        <ListFileUploader
          className="Centered"
          isLoading={isLoading}
          isDropZoneActive={isDropZoneActive}
          handleDrop={handleDrop}
          handleDragLeave={handleDragLeave}
          handleDragEnter={handleDragEnter}
          uploaderSubTitle={uploaderSubTitle}
        />
      );
  };

  const renderConfirmationContent = () => {
    return <MessageBanner type="warning">{confirmationModalMessage}</MessageBanner>;
  };

  return (
    <Modal
      open={open}
      label={modalLabel}
      aria-label={modalLabel}
      footer={renderFooter()}
    >
      {isDefaultStep ? renderUploadContent() : renderConfirmationContent()}
    </Modal>
  );
};

BulkEditManualUploadModal.propTypes = {
  operationId: PropTypes.string,
  identifier: PropTypes.string,
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  setCountOfRecords: PropTypes.func,
  countOfRecords: PropTypes.number,
};

BulkEditManualUploadModal.defaultProps = {
  identifier: IDENTIFIERS.BARCODE,
};

export default BulkEditManualUploadModal;
