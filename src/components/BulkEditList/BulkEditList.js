import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Pane,
  Paneset,
} from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';
import { noop } from 'lodash/util';

import { useHistory } from 'react-router';
import { BulkEditListResult } from './BulkEditListResult';
import { BulkEditActionMenu } from '../BulkEditActionMenu';
import { BulkEditManualUploadModal } from './BulkEditListResult/BulkEditManualUploadModal';
import { usePathParams, useBulkPermissions } from '../../hooks';
import {
  CRITERIA,
  APPROACHES,
  EDITING_STEPS,
  LOGS_FILTERS,
  IDENTIFIER_FILTERS,
  QUERY_FILTERS,
} from '../../constants';
import { BulkEditInApp } from './BulkEditListResult/BulkEditInApp/BulkEditInApp';
import BulkEditInAppPreviewModal from './BulkEditListResult/BulkEditInAppPreviewModal/BulkEditInAppPreviewModal';

import { RootContext } from '../../context/RootContext';
import BulkEditLogs from '../BulkEditLogs/BulkEditLogs';
import { useResetAppState } from '../../hooks/useResetAppState';
import BulkEditInAppLayer from './BulkEditListResult/BulkEditInAppLayer/BulkEditInAppLayer';
import { BulkEditListSidebar } from './BulkEditListSidebar/BulkEditListSidebar';
import { useSearchParams } from '../../hooks/useSearchParams';

export const BulkEditList = () => {
  const history = useHistory();
  const search = new URLSearchParams(history.location.search);

  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
  const [isBulkEditLayerOpen, setIsBulkEditLayerOpen] = useState(false);
  const [countOfRecords, setCountOfRecords] = useState(0);
  const [isPreviewModalOpened, setPreviewModalOpened] = useState(false);
  const [contentUpdates, setContentUpdates] = useState(null);
  const [visibleColumns, setVisibleColumns] = useState(null);
  const [confirmedFileName, setConfirmedFileName] = useState(null);
  const [inAppCommitted, setInAppCommitted] = useState(false);
  const [filtersTab, setFiltersTab] = useState({
    identifierTab: [],
    queryTab: [],
    logsTab: [],
  });

  const { isActionMenuShown } = useBulkPermissions();
  const { id: bulkOperationId } = usePathParams('/bulk-edit/:id');
  const { step, capabilities, criteria, initialFileName } = useSearchParams();
  const identifierFilters = Object.values(IDENTIFIER_FILTERS).map((el) => search.getAll(el));
  const queryFilters = Object.values(QUERY_FILTERS).map((el) => search.getAll(el));
  const logsFilters = Object.values(LOGS_FILTERS).map((el) => search.getAll(el));

  useEffect(() => {
    if (history.location.search) {
      setFiltersTab(prevState => ({
        ...prevState,
        queryTab: queryFilters,
        identifierTab: identifierFilters,
        logsTab: logsFilters,
      }));
    }
  }, [history.location]);

  useResetAppState({
    setConfirmedFileName,
    setCountOfRecords,
    setVisibleColumns,
    filtersTab,
    setIsBulkEditLayerOpen,
    setInAppCommitted,
  });

  const handleBulkEditLayerOpen = () => {
    setIsBulkEditLayerOpen(true);
  };
  const handleBulkEditLayerClose = () => {
    setIsBulkEditLayerOpen(false);
  };

  const handlePreviewModalOpen = () => {
    setPreviewModalOpened(true);
  };

  const handlePreviewModalClose = () => {
    setPreviewModalOpened(false);
  };

  const handleChangesCommited = () => {
    handlePreviewModalClose();
    handleBulkEditLayerClose();
    setInAppCommitted(true);
  };

  const handleStartBulkEdit = (approach) => {
    if (approach === APPROACHES.IN_APP) {
      handleBulkEditLayerOpen();
    }

    if (approach === APPROACHES.MANUAL) {
      setIsBulkEditModalOpen(true);
    }
  };

  const isLogsTab = criteria === CRITERIA.LOGS;
  const isActionMenuVisible = visibleColumns?.length && isActionMenuShown && !isLogsTab;

  const actionMenu = () => (
    isActionMenuVisible && (
      <BulkEditActionMenu
        onEdit={handleStartBulkEdit}
        onToggle={noop}
      />
    )
  );

  const cancelBulkEditStart = () => {
    setIsBulkEditModalOpen(false);
  };

  const paneTitle = useMemo(() => {
    if (confirmedFileName || initialFileName) {
      return (
        <FormattedMessage
          id="ui-bulk-edit.meta.title.uploadedFile"
          values={{ fileName: confirmedFileName || initialFileName }}
        />
      );
    } else return <FormattedMessage id="ui-bulk-edit.meta.title" />;
  }, [confirmedFileName, initialFileName, history.location.search]);

  const changedPaneSubTitle = useMemo(() => (
    step === EDITING_STEPS.UPLOAD ?
      <FormattedMessage id="ui-bulk-edit.list.logSubTitle.matched" values={{ count: countOfRecords }} />
      : <FormattedMessage id="ui-bulk-edit.list.logSubTitle.changed" values={{ count: countOfRecords }} />
  ), [countOfRecords, step]);

  const paneSubtitle = useMemo(() => {
    return (
      step === EDITING_STEPS.UPLOAD || step === EDITING_STEPS.COMMIT
        ? changedPaneSubTitle
        : <FormattedMessage id="ui-bulk-edit.list.logSubTitle" />
    );
  }, [step, changedPaneSubTitle]);


  const defaultPaneProps = {
    defaultWidth: 'fill',
    paneTitle,
    paneSub: paneSubtitle,
    appIcon: <AppIcon app="bulk-edit" iconKey="app" />,
  };

  return (
    <RootContext.Provider value={{
      countOfRecords,
      setCountOfRecords,
      visibleColumns,
      setVisibleColumns,
      confirmedFileName,
      inAppCommitted,
      setInAppCommitted,
      isFileUploaded,
      setIsFileUploaded,
    }}
    >
      <Paneset>
        {/* LOGS_FILTERS PANE */}
        <Pane
          defaultWidth="300px"
          paneTitle={<FormattedMessage id="ui-bulk-edit.list.criteriaTitle" />}
        >
          <BulkEditListSidebar />
        </Pane>

        {/* RESULT PANES */}
        { isLogsTab && <BulkEditLogs /> }

        { !isLogsTab && (
          <Pane
            {...defaultPaneProps}
            actionMenu={actionMenu}
          >
            <BulkEditListResult />
          </Pane>
        )}

        {/* IN_APP APPROACH */}
        <BulkEditInAppLayer
          isLayerOpen={isBulkEditLayerOpen}
          onLayerClose={handleBulkEditLayerClose}
          onConfirm={handlePreviewModalOpen}
          contentUpdates={contentUpdates}
          {...defaultPaneProps}
        >
          <BulkEditInApp
            onContentUpdatesChanged={setContentUpdates}
            capabilities={capabilities}
          />
        </BulkEditInAppLayer>

        {isPreviewModalOpened && (
          <BulkEditInAppPreviewModal
            bulkOperationId={bulkOperationId}
            open={isPreviewModalOpened}
            contentUpdates={contentUpdates}
            onKeepEditing={handlePreviewModalClose}
            onChangesCommited={handleChangesCommited}
          />
        )}
      </Paneset>

      <BulkEditManualUploadModal
        operationId={bulkOperationId}
        open={isBulkEditModalOpen}
        onCancel={cancelBulkEditStart}
        countOfRecords={countOfRecords}
        setCountOfRecords={setCountOfRecords}
      />

    </RootContext.Provider>
  );
};
