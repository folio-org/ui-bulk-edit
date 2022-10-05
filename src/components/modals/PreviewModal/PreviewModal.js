import { saveAs } from 'file-saver';
import { MessageBanner, Modal, MultiColumnList } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router';
import moment from 'moment';
import { Preloader } from '@folio/stripes-data-transfer-components';
import { useOkapiKy } from '@folio/stripes/core';
import { PreviewModalFooter } from './PreviewModalFooter';
import css from './PreviewModal.css';
import { useInAppColumnsInfo } from '../../../hooks/useInAppColumnsInfo';
import { getMappedHoldings, useLaunchJob, useUserGroupsMap } from '../../../API';
import { useInAppUpload } from '../../../API/useInAppUpload';
import { useInAppDownloadPreview } from '../../../API/useInAppDownloadPreview';
import { CAPABILITES_PREVIEW, OPTIONS } from '../../../constants';
import { RootContext } from '../../../context/RootContext';

const PreviewModal = ({
  open,
  jobId,
  contentUpdates,
  onKeepEditing,
  onJobStarted,
  setUpdatedId,
  controller,
}) => {
  const ky = useOkapiKy();
  const history = useHistory();
  const location = useLocation();
  const capability = new URLSearchParams(location.search).get('capabilities');
  const { userGroups } = useUserGroupsMap();
  const {
    columns,
    columnMapping,
    columnWidths,
    formatter,
  } = useInAppColumnsInfo({ capability, userGroups });

  const { visibleColumns } = useContext(RootContext);

  const finalColumns = JSON.parse(visibleColumns) || columns;

  const [previewItems, setPreviewItems] = useState([]);
  const [countOfChangedRecords, setCountOfChangedRecords] = useState(0);

  const { startJob } = useLaunchJob();
  const { inAppUpload, isLoading: isUploading } = useInAppUpload(controller?.signal);
  const {
    data: fileData,
    refetch: downloadPreviewCSV,
    isLoading: isDownloading,
  } = useInAppDownloadPreview(jobId, CAPABILITES_PREVIEW[capability]);

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

      inAppUpload({ jobId, contentUpdates: formattedContentUpdates, capability }).then(async response => {
        const listKey = Object.keys(response)[0];

        // for holdings items should be additionally mapped
        const mappedPreviewItems = listKey === 'holdingsRecords' ? await getMappedHoldings(ky, response[listKey]) : response[listKey];

        setPreviewItems(mappedPreviewItems);
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
          isUploading={isUploading}
          isDownloading={isDownloading}
          onDownloadPreview={downloadPreviewCSV}
          onSave={handleStartJob}
          onKeepEditing={onKeepEditing}
        />
      }
      dismissible
      onClose={onKeepEditing}
    >
      {!isUploading ? (
        <>
          <MessageBanner type="warning">
            <FormattedMessage id="ui-bulk-edit.previewModal.message" values={{ count: countOfChangedRecords }} />
          </MessageBanner>

          <strong className={css.previewModalSubtitle}><FormattedMessage id="ui-bulk-edit.previewModal.previewToBeChanged" /></strong>

          <MultiColumnList
            contentData={previewItems}
            columnWidths={columnWidths}
            columnMapping={columnMapping}
            formatter={formatter}
            visibleColumns={finalColumns}
          />
        </>
      ) : <Preloader />}

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
  controller: PropTypes.object,
};

export default PreviewModal;
