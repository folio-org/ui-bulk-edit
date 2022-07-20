import { saveAs } from 'file-saver';
import { MessageBanner, Modal, MultiColumnList } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router';
import moment from 'moment';
import { PreviewModalFooter } from './PreviewModalFooter';
import { getInventoryResultsFormatterBase } from '../../../constants/formatters';
import { INVENTORY_COLUMNS_BASE } from '../../../constants';
import css from './PreviewModal.css';
import { useInAppUpload } from '../../../API/useInAppUpload';
import { useInAppDownloadPreview } from '../../../API/useInAppDownloadPreview';
import { useLaunchJob } from '../../../API';

const PreviewModal = ({ open, jobId, contentUpdates, onKeepEditing, onJobStarted, setUpdatedId }) => {
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
  const [countOfChangedRecords, setCountOfChangedRecords] = useState(0);

  const { startJob } = useLaunchJob();
  const { inAppUpload, isLoading: isUploading } = useInAppUpload();
  const { data: fileData, refetch: downloadPreviewCSV, isLoading: isDownloading } = useInAppDownloadPreview(jobId);

  const handleStartJob = () => {
    startJob({ jobId });

    setUpdatedId(jobId);
    onJobStarted();

    history.replace({
      pathname: `/bulk-edit/${jobId}/processedProgress`,
      search: location.search,
    });
  };

  useEffect(() => {
    if (jobId && contentUpdates && open) {
      inAppUpload({ jobId, contentUpdates }).then(response => {
        setPreviewItems(response.items);
        setCountOfChangedRecords(response.totalRecords);
      });
    }
  }, [jobId, contentUpdates, open]);

  useEffect(() => {
    if (fileData) {
      const date = moment().format('YYYY-MM-DD');
      const fileName = new URLSearchParams(location.search).get('fileName');

      fileData.blob().then(blob => {
        saveAs(blob, `${date}-Updates- Preview-${fileName}`);
      });
    }
  }, [fileData]);


  return (
    <Modal
      size="large"
      open={open}
      label={<FormattedMessage id="ui-bulk-edit.previewModal.areYouSure" />}
      aria-label="PreviewModal"
      footer={
        <PreviewModalFooter
          isDownloading={isDownloading}
          onDownloadPreview={downloadPreviewCSV}
          onSave={handleStartJob}
          onKeepEditing={onKeepEditing}
        />
    }
      dismissible
      onClose={onKeepEditing}
    >
      <MessageBanner type="warning">
        <FormattedMessage id="ui-bulk-edit.previewModal.message" values={{ count: countOfChangedRecords }} />
      </MessageBanner>

      <strong className={css.previewModalSubtitle}><FormattedMessage id="ui-bulk-edit.previewModal.previewToBeChanged" /></strong>

      <MultiColumnList
        contentData={previewItems}
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
  onJobStarted: PropTypes.func,
  setUpdatedId: PropTypes.func,
  contentUpdates: PropTypes.arrayOf(PropTypes.object),
};

export default PreviewModal;
