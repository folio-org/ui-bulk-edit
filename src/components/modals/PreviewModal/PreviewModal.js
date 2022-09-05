import { saveAs } from 'file-saver';
import { MessageBanner, Modal, MultiColumnList } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router';
import moment from 'moment';
import { PreviewModalFooter } from './PreviewModalFooter';
import css from './PreviewModal.css';
import { useInAppColumnsInfo } from '../../../hooks/useInAppColumnsInfo';
import { useLaunchJob, useUserGroupsMap } from '../../../API';
import { useInAppUpload } from '../../../API/useInAppUpload';
import { useInAppDownloadPreview } from '../../../API/useInAppDownloadPreview';
import { OPTIONS } from '../../../constants';

const PreviewModal = ({
  open,
  jobId,
  contentUpdates,
  onKeepEditing,
  onJobStarted,
  setUpdatedId,
}) => {
  const history = useHistory();
  const location = useLocation();
  const capability = new URLSearchParams(location.search).get('capabilities');
  const { userGroups } = useUserGroupsMap();
  const {
    visibleColumns,
    columnMapping,
    columnWidths,
    formatter,
  } = useInAppColumnsInfo({ capability, userGroups });

  const [previewItems, setPreviewItems] = useState([]);
  const [countOfChangedRecords, setCountOfChangedRecords] = useState(0);

  const { startJob } = useLaunchJob();
  const { inAppUpload, isLoading: isUploading } = useInAppUpload();
  const {
    data: fileData,
    refetch: downloadPreviewCSV,
    isLoading: isDownloading,
  } = useInAppDownloadPreview(jobId, capability?.toLowerCase());

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
      const formattedContentUpdates = contentUpdates.map(item => {
        if (item.option === OPTIONS.EXPIRATION_DATE) {
          const DATE_RFC2822 = 'YYYY-MM-DD HH:mm:ss';
          const getFormattedDate = (value) => `${moment(`${value} 23:59:59`).format(DATE_RFC2822)}.000Z`;

          return {
            ...item,
            actions: item.actions.map(action => ({ ...action, value: getFormattedDate(action.value) })),
          };
        }

        return item;
      });

      inAppUpload({ jobId, contentUpdates: formattedContentUpdates, capability }).then(response => {
        setPreviewItems(response[capability.toLowerCase()]);
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
