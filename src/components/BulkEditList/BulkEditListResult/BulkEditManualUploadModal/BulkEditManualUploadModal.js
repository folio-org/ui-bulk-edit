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

import {
  APPROACHES,
  CAPABILITIES,
  EDITING_STEPS,
  IDENTIFIERS,
  MANUAL_UPLOAD_STEPS,
} from '../../../../constants';
import {
  useUpload,
  useBulkOperationStart,
} from '../../../../hooks/api';
import { useBulkOperationDelete } from '../../../../hooks/api/useBulkOperationDelete';
import { ListFileUploader } from '../../../shared/ListFileUploader';
import { useSearchParams } from '../../../../hooks/useSearchParams';

const BulkEditManualUploadModal = ({
  operationId,
  open,
  onCancel,
  setCountOfRecords,
  countOfRecords,
}) => {
  const history = useHistory();
  const intl = useIntl();
  const callout = useShowCallout();
  const controller = useRef(null);
  const { identifier } = useSearchParams();

  const { fileUpload } = useUpload();
  const { bulkOperationStart } = useBulkOperationStart();

  const [isDropZoneActive, setDropZoneActive] = useState(false);

  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
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

  const { bulkOperationDelete } = useBulkOperationDelete();

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

  const handleCancel = (isCancel = true) => {
    if (controller.current) controller.current.abort();
    if (fileName && isCancel) bulkOperationDelete({ operationId });

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
      handleCancel(false);
    }
  };

  const uploadFileFlow = async (fileToUpload) => {
    controller.current = new AbortController();
    setIsLoading(true);

    try {
      await fileUpload({
        operationId,
        fileToUpload,
        entityType: CAPABILITIES.USER,
        identifierType: identifier || IDENTIFIERS.ID,
        manual: true,
        signal: controller.current.signal,
      });

      const { matchedNumOfRecords } = await bulkOperationStart({
        id: operationId,
        step: EDITING_STEPS.EDIT,
        approach: APPROACHES.MANUAL,
      });

      setFileName(fileToUpload.name);
      setIsLoading(false);
      setCountOfRecords(matchedNumOfRecords);
    } catch (error) {
      setIsLoading(false);
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
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  setCountOfRecords: PropTypes.func,
  countOfRecords: PropTypes.number,
};

export default BulkEditManualUploadModal;
