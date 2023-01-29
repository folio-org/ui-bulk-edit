import { saveAs } from 'file-saver';
import { MessageBanner, Modal, MultiColumnList } from '@folio/stripes/components';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useLocation } from 'react-router';
import { Preloader } from '@folio/stripes-data-transfer-components';
import { useShowCallout } from '@folio/stripes-acq-components';
import { useQueryClient } from 'react-query';
import { PreviewModalFooter } from './PreviewModalFooter';
import css from './PreviewModal.css';
import { APPROACHES, dateNow, FILE_KEYS, FILE_SEARCH_PARAMS } from '../../../constants';
import { RootContext } from '../../../context/RootContext';
import { useRecordsPreview } from '../../../hooks/api/useRecordsPreview';
import { getContentUpdatesBody } from '../../BulkEditList/BulkEditListResult/BulkEditInApp/ContentUpdatesForm/helpers';
import { useBulkOperationStart } from '../../../hooks/api/useBulkOperationStart';
import { useBulkOperationDetails } from '../../../hooks/api/useBulkOperationDetails';
import { useContentUpdate } from '../../../hooks/api/useContentUpdate';
import { useFileDownload } from '../../../hooks/api/useFileDownload';


const PreviewModal = ({
  open,
  bulkOperationId,
  contentUpdates,
  onKeepEditing,
  onChangesCommited,
}) => {
  const queryClient = useQueryClient();
  const callout = useShowCallout();
  const intl = useIntl();
  const history = useHistory();
  const location = useLocation();
  const { visibleColumns } = useContext(RootContext);

  const swwCallout = () => (
    callout({
      type: 'error',
      message: intl.formatMessage({ id: 'ui-bulk-edit.error.sww' }),
    })
  );

  const { bulkDetails } = useBulkOperationDetails({ id: bulkOperationId });

  const { contentUpdate } = useContentUpdate({ id: bulkOperationId });

  const { bulkOperationStart } = useBulkOperationStart({ approachType: APPROACHES.IN_APP });

  const {
    contentData,
    columns,
    formatter,
    refetch: fetchPreview,
  } = useRecordsPreview({
    id: bulkOperationId,
    queryKey: 'recordsPreviewModal',
    enabled: false,
    onError: () => {
      swwCallout();
      onKeepEditing();
    },
  });

  const { refetch } = useFileDownload({
    enabled: false, // to prevent automatic file fetch in preview modal
    id: bulkOperationId,
    fileInfo: {
      fileContentType: FILE_SEARCH_PARAMS.PROPOSED_CHANGES_FILE,
    },
    onSuccess: data => {
      const fileName = new URLSearchParams(location.search).get('fileName');

      saveAs(new Blob([data]), `${dateNow}-Updates-Preview-${fileName}`);
    },
  });

  const visibleColumnKeys = visibleColumns?.filter(item => !item.selected).map(item => item.value);

  const isChangedPreviewReady = bulkDetails && Object.hasOwn(bulkDetails, FILE_KEYS.PROPOSED_CHANGES_LINK);

  // TODO: need to add on BE
  const [countOfChangedRecords] = useState(0);

  const handleBulkOperationStart = async () => {
    try {
      await bulkOperationStart({ id: bulkOperationId });

      onChangesCommited();

      history.replace({
        pathname: `/bulk-edit/${bulkOperationId}/progress`,
        search: location.search,
      });
    } catch {
      swwCallout();
    }
  };

  useEffect(() => {
    if (contentUpdates && open) {
      const contentUpdatesBody = getContentUpdatesBody({
        bulkOperationId,
        contentUpdates,
        totalRecords: bulkDetails.totalNumOfRecords,
      });

      contentUpdate({ contentUpdates: contentUpdatesBody })
        .then(() => bulkOperationStart({ id: bulkOperationId }))
        .then(() => fetchPreview())
        .then(() => queryClient.invalidateQueries('bulkOperationDetails'))
        .catch(() => {
          swwCallout();
          onKeepEditing();
        });
    }
  }, [contentUpdates, open]);

  return (
    <Modal
      size="large"
      open={open}
      label={<FormattedMessage id="ui-bulk-edit.previewModal.areYouSure" />}
      aria-label="PreviewModal"
      footer={
        <PreviewModalFooter
          isChangedPreviewReady={isChangedPreviewReady}
          onDownloadPreview={refetch}
          onSave={handleBulkOperationStart}
          onKeepEditing={onKeepEditing}
        />
      }
      dismissible
      onClose={onKeepEditing}
    >
      {contentData ? (
        <>
          <MessageBanner type="warning">
            <FormattedMessage id="ui-bulk-edit.previewModal.message" values={{ count: countOfChangedRecords }} />
          </MessageBanner>

          <strong className={css.previewModalSubtitle}><FormattedMessage id="ui-bulk-edit.previewModal.previewToBeChanged" /></strong>

          <MultiColumnList
            contentData={contentData}
            columnMapping={columns}
            formatter={formatter}
            visibleColumns={visibleColumnKeys}
          />
        </>
      ) : <Preloader />}
    </Modal>
  );
};

PreviewModal.propTypes = {
  open: PropTypes.bool,
  bulkOperationId: PropTypes.string,
  onKeepEditing: PropTypes.func,
  onChangesCommited: PropTypes.func,
  contentUpdates: PropTypes.arrayOf(PropTypes.object),
};

export default PreviewModal;
