import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { ConfirmationModal, MessageBanner } from '@folio/stripes/components';

import { useStartBulkDelete } from '../../../../hooks';
import { LOGS_RETENTION_DAYS } from '../../../../constants';

const BulkEditDeleteModal = ({
  open,
  bulkOperationId,
  countOfRecords,
  onClose,
}) => {
  const { startBulkDelete, isDeleting } = useStartBulkDelete({
    bulkOperationId,
    onDeleteStarted: onClose,
  });

  return (
    <ConfirmationModal
      open={open}
      heading={<FormattedMessage id="ui-bulk-edit.start.delete.modal.heading" />}
      message={(
        <>
          <MessageBanner type="warning">
            <FormattedMessage
              id="ui-bulk-edit.start.delete.modal.message"
              values={{ count: countOfRecords }}
            />
          </MessageBanner>
          <p>
            <FormattedMessage
              id="ui-bulk-edit.start.delete.modal.note"
              values={{ days: LOGS_RETENTION_DAYS }}
            />
          </p>
        </>
      )}
      confirmLabel={<FormattedMessage id="ui-bulk-edit.start.delete.modal.confirm" />}
      onConfirm={startBulkDelete}
      onCancel={onClose}
      isConfirmButtonDisabled={isDeleting}
    />
  );
};

BulkEditDeleteModal.propTypes = {
  open: PropTypes.bool.isRequired,
  bulkOperationId: PropTypes.string,
  countOfRecords: PropTypes.number,
  onClose: PropTypes.func.isRequired,
};

export default BulkEditDeleteModal;

