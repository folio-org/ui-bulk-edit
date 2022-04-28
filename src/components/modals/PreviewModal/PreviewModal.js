import { MessageBanner, Modal, MultiColumnList } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router';
import { PreviewModalFooter } from './PreviewModalFooter';
import { getInventoryResultsFormatterBase } from '../../../constants/formatters';
import { INVENTORY_COLUMNS_BASE } from '../../../constants';
import css from './PreviewModal.css';
import { useInAppUpload } from '../../../API/useInAppUpload';
import { useInAppDownloadPreview } from '../../../API/useInAppDownloadPreview';
import { useLaunchJob } from '../../../API';

const PreviewModal = ({ open, jobId, onKeepEditing }) => {
  const history = useHistory();
  const location = useLocation();
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

  const [previewItems, setPreviewItems] = useState([]);

  const { startJob } = useLaunchJob();
  const { inAppUpload, isLoading: isUploading } = useInAppUpload();
  const { refetch: downloadPreviewCSV, isLoading: isDownloading } = useInAppDownloadPreview(jobId);

  useEffect(() => {
    if (jobId) {
      inAppUpload({ jobId }).then(response => setPreviewItems(response));
    }
  }, [jobId]);

  const handleStartJob = async () => {
    try {
      await startJob(jobId);

      history.replace({
        pathname: `/bulk-edit/${jobId}/progress`,
        search: location.search,
      });
    } catch {
      history.replace({
        pathname: '/bulk-edit',
      });
    }
  };


  return (
    <Modal
      size="large"
      open={open}
      label={<FormattedMessage id="ui-bulk-edit.previewModal.areYouSure" />}
      aria-label="PreviewModal"
      footer={
        <PreviewModalFooter
          isDownloading={isDownloading}
          onDownloadPreview={() => downloadPreviewCSV()}
          onSave={handleStartJob}
          onKeepEditing={onKeepEditing}
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
        contentData={previewItems || [{
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
        loading={isUploading}
      />
    </Modal>
  );
};

PreviewModal.propTypes = {
  open: PropTypes.bool,
  jobId: PropTypes.string,
  onKeepEditing: PropTypes.func,
};

export default PreviewModal;
