import React, { useCallback, useContext, useEffect, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { useQueryClient } from 'react-query';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { saveAs } from 'file-saver';

import { MessageBanner, Modal, MultiColumnList } from '@folio/stripes/components';
import { Preloader } from '@folio/stripes-data-transfer-components';
import { buildSearch, PrevNextPagination, useShowCallout } from '@folio/stripes-acq-components';

import { RootContext } from '../../../../context/RootContext';
import {
  APPROACHES,
  EDITING_STEPS,
  FILE_KEYS,
  FILE_SEARCH_PARAMS,
  PAGINATION_CONFIG,
  getFormattedFilePrefixDate,
} from '../../../../constants';
import {
  useRecordsPreview,
  useBulkOperationStart,
  useBulkOperationDetails,
  useContentUpdate,
  useFileDownload,
  QUERY_KEY_DOWNLOAD_IN_APP,
  IN_APP_PREVIEW_KEY,
  BULK_OPERATION_DETAILS_KEY,
} from '../../../../hooks/api';
import { getContentUpdatesBody } from '../BulkEditInApp/ContentUpdatesForm/helpers';
import { BulkEditInAppPreviewModalFooter } from './BulkEditInAppPreviewModalFooter';
import css from './BulkEditInAppPreviewModal.css';
import { getVisibleColumnsKeys } from '../../../../utils/helpers';
import { PREVIEW_COLUMN_WIDTHS } from '../../../PermissionsModal/constants/lists';
import { usePagination } from '../../../../hooks/usePagination';
import { useSearchParams } from '../../../../hooks/useSearchParams';

export const BulkEditInAppPreviewModal = ({
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
  const {
    currentRecordType,
    criteria,
    initialFileName
  } = useSearchParams();

  const swwCallout = useCallback(() => (
    callout({
      type: 'error',
      message: intl.formatMessage({ id: 'ui-bulk-edit.error.sww' }),
    })
  ), [callout, intl]);

  const { bulkDetails } = useBulkOperationDetails({ id: bulkOperationId });
  const { contentUpdate } = useContentUpdate({ id: bulkOperationId });
  const { bulkOperationStart, startData } = useBulkOperationStart();

  const totalRecords = bulkDetails?.totalNumOfRecords;

  const {
    pagination,
    changePage,
  } = usePagination(PAGINATION_CONFIG);

  const [isPreviewLoading, setIsPreviewLoading] = useState(false);

  const {
    contentData,
    columnMapping,
    isFetching
  } = useRecordsPreview({
    key: IN_APP_PREVIEW_KEY,
    id: bulkOperationId,
    step: EDITING_STEPS.EDIT,
    capabilities: currentRecordType,
    queryOptions: {
      enabled: !!startData,
      onError: () => {
        swwCallout();
        onKeepEditing();
      },
    },
    ...pagination,
  });

  const { refetch } = useFileDownload({
    queryKey: QUERY_KEY_DOWNLOAD_IN_APP,
    enabled: false, // to prevent automatic file fetch in preview modal
    id: bulkOperationId,
    fileInfo: {
      fileContentType: FILE_SEARCH_PARAMS.PROPOSED_CHANGES_FILE,
    },
    onSuccess: fileData => {
      let fileName = initialFileName;

      if (!initialFileName) {
        fileName = `${criteria.charAt(0).toUpperCase().toUpperCase() + criteria.slice(1)}-${bulkOperationId}.csv`;
      }

      saveAs(new Blob([fileData]), `${getFormattedFilePrefixDate()}-Updates-Preview-${fileName}`);
    },
  });

  const visibleColumnKeys = getVisibleColumnsKeys(visibleColumns);

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
        pathname: `/bulk-edit/${bulkOperationId}/preview`,
        search: buildSearch({
          progress: criteria,
        }, history.location.search),
      });
    } catch {
      swwCallout();
    }
  };

  useEffect(() => {
    if (contentUpdates && open && totalRecords) {
      const contentUpdatesBody = getContentUpdatesBody({
        bulkOperationId,
        contentUpdates,
        totalRecords,
      });

      setIsPreviewLoading(true);

      contentUpdate({ contentUpdates: contentUpdatesBody })
        .then(() => bulkOperationStart({
          id: bulkOperationId,
          approach: APPROACHES.IN_APP,
          step: EDITING_STEPS.EDIT,
        }))
        .then(() => {
          queryClient.invalidateQueries(BULK_OPERATION_DETAILS_KEY);
          queryClient.invalidateQueries(IN_APP_PREVIEW_KEY);
        })
        .catch(() => {
          swwCallout();
          onKeepEditing();
        })
        .finally(() => {
          setIsPreviewLoading(false);
        });
    }
  }, [
    contentUpdates,
    open,
    totalRecords,
    bulkOperationId,
    contentUpdate,
    bulkOperationStart,
    queryClient,
    onKeepEditing,
    swwCallout
  ]);

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
            columnIdPrefix="in-app"
            columnWidths={PREVIEW_COLUMN_WIDTHS}
            loading={isFetching}
          />

          {contentData.length > 0 && (
            <PrevNextPagination
              {...pagination}
              totalCount={bulkDetails?.matchedNumOfRecords}
              disabled={false}
              onChange={changePage}
            />
          )}
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
