import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router';

import {
  Button,
  Modal,
  ModalFooter,
  MessageBanner,
} from '@folio/stripes/components';

import { useRollBack, useLaunchJob } from '../../API/useFileUpload';

const BulkEditConformationModal = ({
  open,
  setIsBulkConformationModal,
  fileName,
  countOfRecords,
  updatedId,
}) => {
  const intl = useIntl();

  const modalLabel = intl.formatMessage({ id: 'ui-bulk-edit.meta.title.conformationModal' }, { fileName });
  const confirmLabel = intl.formatMessage({ id: 'stripes-components.saveAndClose' });
  const cancelLabel = intl.formatMessage({ id: 'stripes-components.cancel' });
  const modalContent = intl.formatMessage({ id: 'ui-bulk-edit.conformationModal.message' }, { count: countOfRecords });

  const history = useHistory();

  const { startJob } = useLaunchJob();
  const { rollBackJob } = useRollBack();

  const onStartJob = async () => {
    await startJob({ id: updatedId });
    setIsBulkConformationModal(false);

    history.replace({
      pathname: '/bulk-edit/progress',
    });
  };

  const onCancelJob = async () => {
    await rollBackJob({ id: updatedId });
    setIsBulkConformationModal(false);
  };

  const footer = (
    <ModalFooter>
      <Button
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
  fileName: PropTypes.string.isRequired,
  countOfRecords: PropTypes.number,
  updatedId: PropTypes.string,
};

export default BulkEditConformationModal;
