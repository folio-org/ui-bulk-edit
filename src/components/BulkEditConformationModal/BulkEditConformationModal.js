import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Button,
  Modal,
  ModalFooter,
  MessageBanner,
} from '@folio/stripes/components';


const BulkEditConformationModal = ({
  open,
  onCancel,
  fileName,
}) => {
  const intl = useIntl();

  const modalLabel = intl.formatMessage({ id: 'ui-bulk-edit.meta.title.conformationModal' }, { fileName });
  const confirmLabel = intl.formatMessage({ id: 'stripes-components.saveAndClose' });
  const cancelLabel = intl.formatMessage({ id: 'stripes-components.cancel' });
  const modalContent = intl.formatMessage({ id: 'ui-bulk-edit.conformationModal.message' }, { count: 300 });

  const onStartbulkEdit = () => {
    onCancel();
  };
-
  const footer = (
    <ModalFooter>
      <Button
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
      <MessageBanner type="warning">{modalContent}</MessageBanner>
    </Modal>
  );
};

BulkEditConformationModal.propTypes = {
  open: PropTypes.bool.isRequired,
  onCancel: PropTypes.func.isRequired,
  fileName: PropTypes.string.isRequired,
};

export default BulkEditConformationModal;
