import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';

import {
  Button,
  Modal,
  ModalFooter,
  MessageBanner,
} from '@folio/stripes/components';

import { useLocation } from 'react-router-dom';
import { useRollBack, useLaunchJob } from '../../../hooks/api';

const BulkEditConformationModal = ({
  open,
  onCancel,
  setIsBulkConformationModal,
  fileName,
  countOfRecords,
  setConfirmedFileName,
  setProcessedFileName,
  updatedId,
}) => {
  const intl = useIntl();
  const location = useLocation();

  const modalLabel = intl.formatMessage({ id: 'ui-bulk-edit.meta.title.conformationModal' }, { fileName });
  const confirmLabel = intl.formatMessage({ id: 'ui-bulk-edit.conformationModal.commitChanges' });
  const cancelLabel = intl.formatMessage({ id: 'stripes-components.cancel' });
  const modalContent = intl.formatMessage({ id: 'ui-bulk-edit.conformationModal.message' }, { count: countOfRecords });

  const history = useHistory();

  const { startJob } = useLaunchJob();
  const { rollBackJob } = useRollBack();

  const onStartJob = async () => {
    await startJob({ jobId: updatedId });

    setConfirmedFileName(fileName);
    setProcessedFileName(null);

    setIsBulkConformationModal(false);

    history.replace({
      pathname: `/bulk-edit/${updatedId}/progress`,
      search: location.search,
    });
  };

  const onCancelJob = async () => {
    await rollBackJob({ id: updatedId });

    setProcessedFileName(null);

    setIsBulkConformationModal(false);

    onCancel();
  };

  const footer = (
    <ModalFooter>
      <Button
        buttonStyle="primary"
        onClick={onStartJob}
      >
        {confirmLabel}
      </Button>
      <Button
        onClick={onCancelJob}
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
      <MessageBanner type="warning">{modalContent}</MessageBanner>
    </Modal>
  );
};

BulkEditConformationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  setIsBulkConformationModal: PropTypes.func.isRequired,
  fileName: PropTypes.string,
  countOfRecords: PropTypes.number,
  updatedId: PropTypes.string,
  setConfirmedFileName: PropTypes.func,
  setProcessedFileName: PropTypes.func,
  onCancel: PropTypes.func,
};

export default BulkEditConformationModal;
