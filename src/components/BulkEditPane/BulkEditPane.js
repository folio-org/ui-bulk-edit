import React, { useCallback, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Pane,
  Paneset,
} from '@folio/stripes/components';
import { noop } from 'lodash/util';

import { BulkEditActionMenu } from '../BulkEditActionMenu';
import { BulkEditManualUploadModal } from './BulkEditListResult/BulkEditManualUploadModal';
import { usePathParams, useBulkPermissions } from '../../hooks';
import {
  CRITERIA,
  APPROACHES,
} from '../../constants';
import { BulkEditInApp } from './BulkEditListResult/BulkEditInApp/BulkEditInApp';
import { BulkEditInAppPreviewModal } from './BulkEditListResult/BulkEditInAppPreviewModal/BulkEditInAppPreviewModal';

import { RootContext } from '../../context/RootContext';
import { BulkEditLogs } from '../BulkEditLogs/BulkEditLogs';
import { useResetAppState } from '../../hooks/useResetAppState';
import { BulkEditInAppLayer } from './BulkEditListResult/BulkEditInAppLayer/BulkEditInAppLayer';
import { BulkEditListSidebar } from './BulkEditListSidebar/BulkEditListSidebar';
import { useSearchParams } from '../../hooks/useSearchParams';
import { useBulkOperationDetails } from '../../hooks/api';
import { BulkEditQuery } from './BulkEditQuery/BulkEditQuery';
import { BulkEditIdentifiers } from './BulkEditIdentifiers/BulkEditIdentifiers';
import { useResetFilters } from '../../hooks/useResetFilters';

export const BulkEditPane = () => {
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
  const [isBulkEditLayerOpen, setIsBulkEditLayerOpen] = useState(false);
  const [countOfRecords, setCountOfRecords] = useState(0);
  const [isPreviewModalOpened, setIsPreviewModalOpened] = useState(false);
  const [contentUpdates, setContentUpdates] = useState(null);
  const [visibleColumns, setVisibleColumns] = useState(null);
  const [confirmedFileName, setConfirmedFileName] = useState(null);
  const [inAppCommitted, setInAppCommitted] = useState(false);

  const { isActionMenuShown } = useBulkPermissions();
  const { id: bulkOperationId } = usePathParams('/bulk-edit/:id');
  const {
    step,
    criteria,
  } = useSearchParams();

  const { bulkDetails } = useBulkOperationDetails({ id: bulkOperationId, additionalQueryKeys: [step] });
  const { filtersTab } = useResetFilters();

  const isLogsTab = criteria === CRITERIA.LOGS;
  const isQueryTab = criteria === CRITERIA.QUERY;
  const isIdentifierTab = criteria === CRITERIA.IDENTIFIER;
  const isQueryTabWithPreview = isQueryTab && visibleColumns?.length && bulkDetails?.fqlQuery;
  const isIdentifierTabWithPreview = isIdentifierTab && visibleColumns?.length && !bulkDetails?.fqlQuery;
  const isActionMenuVisible = (isQueryTabWithPreview || isIdentifierTabWithPreview) && isActionMenuShown && !isLogsTab;

  const providerValue = useMemo(() => ({
    countOfRecords,
    setCountOfRecords,
    visibleColumns,
    setVisibleColumns,
    confirmedFileName,
    inAppCommitted,
    setInAppCommitted,
    isFileUploaded,
    setIsFileUploaded,
    setIsBulkEditLayerOpen,
  }), [
    countOfRecords,
    visibleColumns,
    confirmedFileName,
    inAppCommitted,
    isFileUploaded
  ]);

  useResetAppState({
    setConfirmedFileName,
    setCountOfRecords,
    setVisibleColumns,
    filtersTab,
    setIsBulkEditLayerOpen,
    setInAppCommitted,
  });

  const handleBulkEditLayerOpen = useCallback(() => {
    setIsBulkEditLayerOpen(true);
  }, []);
  const handleBulkEditLayerClose = useCallback(() => {
    setIsBulkEditLayerOpen(false);
  }, []);

  const handlePreviewModalOpen = useCallback(() => {
    setIsPreviewModalOpened(true);
  }, []);

  const handlePreviewModalClose = useCallback(() => {
    setIsPreviewModalOpened(false);
  }, []);

  const handleChangesCommitted = useCallback(() => {
    handlePreviewModalClose();
    handleBulkEditLayerClose();
    setInAppCommitted(true);
  }, [handleBulkEditLayerClose, handlePreviewModalClose]);

  const handleStartBulkEdit = (approach) => {
    if (approach === APPROACHES.IN_APP) {
      handleBulkEditLayerOpen();
    }

    if (approach === APPROACHES.MANUAL) {
      setIsBulkEditModalOpen(true);
    }
  };
  const handleCancelBulkEdit = () => {
    setIsBulkEditModalOpen(false);
  };

  const renderActionMenu = () => isActionMenuVisible && (
    <BulkEditActionMenu
      onEdit={handleStartBulkEdit}
      onToggle={noop}
    />
  );

  const renderAppLayer = (paneProps) => {
    return (
      <>
        <BulkEditInAppLayer
          isLayerOpen={isBulkEditLayerOpen}
          onLayerClose={handleBulkEditLayerClose}
          onConfirm={handlePreviewModalOpen}
          contentUpdates={contentUpdates}
          {...paneProps}
        >
          <BulkEditInApp
            onContentUpdatesChanged={setContentUpdates}
          />
        </BulkEditInAppLayer>

        {isPreviewModalOpened && (
          <BulkEditInAppPreviewModal
            bulkOperationId={bulkOperationId}
            open={isPreviewModalOpened}
            contentUpdates={contentUpdates}
            onKeepEditing={handlePreviewModalClose}
            onChangesCommited={handleChangesCommitted}
          />
        )}
      </>
    );
  };

  const renderManualUploadModal = () => (
    <BulkEditManualUploadModal
      operationId={bulkOperationId}
      open={isBulkEditModalOpen}
      onCancel={handleCancelBulkEdit}
      countOfRecords={countOfRecords}
      setCountOfRecords={setCountOfRecords}
    />
  );

  return (
    <RootContext.Provider value={providerValue}>
      <Paneset>
        {/* LOGS_FILTERS PANE */}
        <Pane
          defaultWidth="300px"
          paneTitle={<FormattedMessage id="ui-bulk-edit.list.criteriaTitle" />}
        >
          <BulkEditListSidebar />
        </Pane>

        {/* RESULT PANES */}
        { isIdentifierTab && (
          <BulkEditIdentifiers
            bulkDetails={bulkDetails}
            renderInAppApproach={renderAppLayer}
            renderManualApproach={renderManualUploadModal}
            actionMenu={renderActionMenu}
          />
        )}

        { isQueryTab && (
          <BulkEditQuery
            bulkDetails={bulkDetails}
            renderInAppApproach={renderAppLayer}
            renderManualApproach={renderManualUploadModal}
            actionMenu={renderActionMenu}
          />
        )}

        { isLogsTab && <BulkEditLogs /> }
      </Paneset>

    </RootContext.Provider>
  );
};
