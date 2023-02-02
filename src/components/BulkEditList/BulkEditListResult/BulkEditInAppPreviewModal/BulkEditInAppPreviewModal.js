import { saveAs } from 'file-saver';
import { MessageBanner, Modal, MultiColumnList } from '@folio/stripes/components';
import { FormattedMessage, useIntl } from 'react-intl';
import PropTypes from 'prop-types';
import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { Preloader } from '@folio/stripes-data-transfer-components';
import { useShowCallout } from '@folio/stripes-acq-components';
import { useQueryClient } from 'react-query';
import { BulkEditInAppPreviewModalFooter } from './BulkEditInAppPreviewModalFooter';
import css from './BulkEditInAppPreviewModal.css';
import { APPROACHES, dateNow, EDITING_STEPS, FILE_KEYS, FILE_SEARCH_PARAMS } from '../../../../constants';
import { RootContext } from '../../../../context/RootContext';
import { useRecordsPreview } from '../../../../hooks/api/useRecordsPreview';
import { getContentUpdatesBody } from '../BulkEditInApp/ContentUpdatesForm/helpers';
import { useBulkOperationStart } from '../../../../hooks/api/useBulkOperationStart';
import { useBulkOperationDetails } from '../../../../hooks/api/useBulkOperationDetails';
import { useContentUpdate } from '../../../../hooks/api/useContentUpdate';
import { useFileDownload } from '../../../../hooks/api/useFileDownload';


const BulkEditInAppPreviewModal = ({
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
  const { visibleColumns } = useContext(RootContext);

  const swwCallout = () => (
    callout({
      type: 'error',
      message: intl.formatMessage({ id: 'ui-bulk-edit.error.sww' }),
    })
  );

  const { bulkDetails } = useBulkOperationDetails({ id: bulkOperationId });
  const { contentUpdate } = useContentUpdate({ id: bulkOperationId });
  const { bulkOperationStart } = useBulkOperationStart();

  const {
    contentData,
    columnsMapping,
    formatter,
    refetch: fetchPreview,
  } = useRecordsPreview({
    id: bulkOperationId,
    step: EDITING_STEPS.EDIT,
    queryOptions: {
      enabled: false,
      onError: () => {
        swwCallout();
        onKeepEditing();
      },
    },
  });

  const { refetch } = useFileDownload({
    enabled: false, // to prevent automatic file fetch in preview modal
    id: bulkOperationId,
    fileInfo: {
      fileContentType: FILE_SEARCH_PARAMS.PROPOSED_CHANGES_FILE,
    },
    onSuccess: data => {
      const fileName = new URLSearchParams(history.location.search).get('fileName');

      saveAs(new Blob([data]), `${dateNow}-Updates-Preview-${fileName}`);
    },
  });

  const visibleColumnKeys = visibleColumns?.filter(item => !item.selected).map(item => item.value);

  const isChangedPreviewReady = bulkDetails && Object.hasOwn(bulkDetails, FILE_KEYS.PROPOSED_CHANGES_LINK);

  const handleBulkOperationStart = async () => {
    try {
      await bulkOperationStart({
        id: bulkOperationId,
        approach: APPROACHES.IN_APP,
        step: EDITING_STEPS.COMMIT,
      });

      onChangesCommited();

      history.replace({
        pathname: `/bulk-edit/${bulkOperationId}/progress`,
        search: history.location.search,
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
        .then(() => bulkOperationStart({
          id: bulkOperationId,
          approach: APPROACHES.IN_APP,
          step: EDITING_STEPS.EDIT,
        }))
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
        <BulkEditInAppPreviewModalFooter
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
            <FormattedMessage id="ui-bulk-edit.previewModal.message" values={{ count: bulkDetails?.matchedNumOfRecords }} />
          </MessageBanner>

          <strong className={css.previewModalSubtitle}><FormattedMessage id="ui-bulk-edit.previewModal.previewToBeChanged" /></strong>

          <MultiColumnList
            contentData={contentData}
            columnMapping={columnsMapping}
            formatter={formatter}
            visibleColumns={visibleColumnKeys}
          />
        </>
      ) : <Preloader />}
    </Modal>
  );
};

BulkEditInAppPreviewModal.propTypes = {
  open: PropTypes.bool,
  bulkOperationId: PropTypes.string,
  onKeepEditing: PropTypes.func,
  onChangesCommited: PropTypes.func,
  contentUpdates: PropTypes.arrayOf(PropTypes.object),
};

export default BulkEditInAppPreviewModal;
