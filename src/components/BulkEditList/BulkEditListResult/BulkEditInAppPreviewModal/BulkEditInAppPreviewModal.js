import React, { useContext, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { saveAs } from 'file-saver';

import { MessageBanner, Modal, MultiColumnList } from '@folio/stripes/components';
import { Preloader } from '@folio/stripes-data-transfer-components';
import { useShowCallout } from '@folio/stripes-acq-components';

import { RootContext } from '../../../../context/RootContext';
import {
  APPROACHES,
  EDITING_STEPS,
  FILE_KEYS,
  FILE_SEARCH_PARAMS,
  getFormattedFilePrefixDate,
} from '../../../../constants';
import {
  useRecordsPreview,
  useBulkOperationStart,
  useBulkOperationDetails,
  useContentUpdate,
  useFileDownload,
} from '../../../../hooks/api';

import { getContentUpdatesBody } from '../BulkEditInApp/ContentUpdatesForm/helpers';
import { BulkEditInAppPreviewModalFooter } from './BulkEditInAppPreviewModalFooter';

import css from './BulkEditInAppPreviewModal.css';

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
  const search = new URLSearchParams(history.location.search);
  const capabilities = search.get('capabilities');
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

  const [isPreviewLoading, setIsLoadingPreview] = useState(false);
  const {
    contentData,
    columnMapping,
    refetch: fetchPreview,
  } = useRecordsPreview({
    id: bulkOperationId,
    step: EDITING_STEPS.EDIT,
    capabilities,
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
      const searchParams = new URLSearchParams(history.location.search);
      let fileName = searchParams.get('fileName');

      if (!fileName) {
        fileName = `${capabilities}-${searchParams.get('criteria')}.csv`;
      }

      saveAs(new Blob([data]), `${getFormattedFilePrefixDate()}-Updates-Preview-${fileName}`);
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

      setIsLoadingPreview(true);

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
        })
        .finally(() => {
          setIsLoadingPreview(false);
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
          isChangedPreviewReady={isChangedPreviewReady && !isPreviewLoading}
          onDownloadPreview={refetch}
          onSave={handleBulkOperationStart}
          onKeepEditing={onKeepEditing}
        />
      }
      dismissible
      onClose={onKeepEditing}
    >
      {contentData && !isPreviewLoading ? (
        <>
          <MessageBanner type="warning">
            <FormattedMessage id="ui-bulk-edit.previewModal.message" values={{ count: bulkDetails?.matchedNumOfRecords }} />
          </MessageBanner>

          <strong className={css.previewModalSubtitle}><FormattedMessage id="ui-bulk-edit.previewModal.previewToBeChanged" /></strong>

          <MultiColumnList
            striped
            contentData={contentData}
            columnMapping={columnMapping}
            visibleColumns={visibleColumnKeys}
            maxHeight={300}
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
