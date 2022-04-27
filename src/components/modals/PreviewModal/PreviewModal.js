import { MessageBanner, Modal, MultiColumnList } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { useState } from 'react';
import { PreviewModalFooter } from './PreviewModalFooter';
import { getInventoryResultsFormatterBase } from '../../../constants/formatters';
import { INVENTORY_COLUMNS_BASE } from '../../../constants';
import css from './PreviewModal.css';
import { useInAppDownloadPreview } from '../../../API/useInAppDownloadPreview';

const PreviewModal = ({ open, jobId, onKeepEditing, onSave }) => {
  const formatter = getInventoryResultsFormatterBase();
  const visibleColumns = Object.keys(formatter);
  const columnMapping = INVENTORY_COLUMNS_BASE.reduce((acc, el) => {
    acc[el.value] = el.label;

    return acc;
  }, {});
  const columnWidths = {
    barcode: '110px',
    status: '110px',
    effectiveLocation: '160px',
    materialType: '100px',
    permanentLoanType: '120px',
    temporaryLoanType: '120px',
  };

  const [downloadClicked, setDownloadClicked] = useState(false);

  const query = useInAppDownloadPreview(jobId, downloadClicked);

  console.log(query);


  return (
    <Modal
      size="large"
      open={open}
      label={<FormattedMessage id="ui-bulk-edit.previewModal.areYouSure" />}
      aria-label="PreviewModal"
      footer={
        <PreviewModalFooter
          onDownloadPreview={() => setDownloadClicked(true)}
          onKeepEditing={onKeepEditing}
          onSave={onSave}
        />
    }
      dismissible
      onClose={onKeepEditing}
    >
      <MessageBanner type="warning">
        <FormattedMessage id="ui-bulk-edit.previewModal.message" values={{ count: 248 }} />
      </MessageBanner>

      <strong className={css.previewModalSubtitle}><FormattedMessage id="ui-bulk-edit.previewModal.previewToBeChanged" /></strong>

      <MultiColumnList
        contentData={[{
          active: true,
          barcode: '222',
          status: { name: 'active' },
          effectiveLocation: { name: 'effectiveLocation' },
          callNumber: 'callNumber',
          hrid: 'hrid',
          materialType: { name: 'materialType' },
          permanentLoanType: { name: 'permanentLoanType' },
          temporaryLoanType: { name: 'temporaryLoanType' },
        }]}
        columnWidths={columnWidths}
        columnMapping={columnMapping}
        formatter={formatter}
        visibleColumns={visibleColumns}
      />
    </Modal>
  );
};

PreviewModal.propTypes = {
  open: PropTypes.bool,
  jobId: PropTypes.string,
  onDownloadPreview: PropTypes.func,
  onKeepEditing: PropTypes.func,
  onSave: PropTypes.func,
};

export default PreviewModal;
