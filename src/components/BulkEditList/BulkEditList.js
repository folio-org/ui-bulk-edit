import React, {
  useEffect,
  useMemo,
  useState,
} from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Pane,
  Paneset,
  PaneFooter,
  Button,
} from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';
import { noop } from 'lodash/util';

import { useHistory } from 'react-router';
import { BulkEditListFilters } from './BulkEditListFilters/BulkEditListFilters';
import { BulkEditListResult } from './BulkEditListResult';
import { BulkEditActionMenu } from '../BulkEditActionMenu';
import { BulkEditManualUploadModal } from './BulkEditListResult/BulkEditManualUploadModal';
import { usePathParams, useBulkPermissions } from '../../hooks';
import {
  CRITERIA,
  APPROACHES,
  EDITING_STEPS,
  FILTERS,
} from '../../constants';
import { BulkEditInApp } from './BulkEditListResult/BulkEditInApp/BulkEditInApp';
import BulkEditInAppPreviewModal from './BulkEditListResult/BulkEditInAppPreviewModal/BulkEditInAppPreviewModal';

import { RootContext } from '../../context/RootContext';
import BulkEditLogs from '../BulkEditLogs/BulkEditLogs';
import { getDefaultCapabilities } from '../../utils/filters';
import { useResetAppState } from '../../hooks/useResetAppState';
import BulkEditInAppLayer from './BulkEditListResult/BulkEditInAppLayer/BulkEditInAppLayer';

export const BulkEditList = () => {
  const history = useHistory();
  const search = new URLSearchParams(history.location.search);

  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
  const [isBulkEditLayerOpen, setIsBulkEditLayerOpen] = useState(false);
  const [countOfRecords, setCountOfRecords] = useState(0);
  const [isPreviewModalOpened, setPreviewModalOpened] = useState(false);
  const [contentUpdates, setContentUpdates] = useState(null);
  const [newBulkFooterShown, setNewBulkFooterShown] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(null);
  const [confirmedFileName, setConfirmedFileName] = useState(null);
  const [filtersTab, setFiltersTab] = useState({
    logsTab: [],
  });

  const { isActionMenuShown, ...restPerms } = useBulkPermissions();
  const { id: bulkOperationId } = usePathParams('/bulk-edit/:id');
  const step = search.get('step');
  const capabilities = search.get('capabilities');
  const criteria = search.get('criteria');
  const logsFilters = Object.values(FILTERS).map((el) => search.getAll(el));
  const defaultCapability = capabilities || getDefaultCapabilities(criteria, restPerms);

  useEffect(() => {
    if (history.location.search) {
      setFiltersTab(prevState => ({
        ...prevState,
        logsTab: logsFilters,
      }));
    }
  }, [history.location]);

  const initialFiltersState = {
    criteria: CRITERIA.IDENTIFIER,
    capabilities: defaultCapability,
    queryText: '',
    recordIdentifier: '',
  };

  const [filters, setFilters] = useState(initialFiltersState);

  useResetAppState({
    initialFiltersState,
    setFilters,
    setConfirmedFileName,
    setCountOfRecords,
    setNewBulkFooterShown,
    setVisibleColumns,
    filtersTab,
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
    const fileUploadedName = search.get('fileName');

    if (confirmedFileName || fileUploadedName) {
      return (
        <FormattedMessage
          id="ui-bulk-edit.meta.title.uploadedFile"
          values={{ fileName: confirmedFileName || fileUploadedName }}
        />
      );
    } else return <FormattedMessage id="ui-bulk-edit.meta.title" />;
  }, [confirmedFileName, history.location.search]);

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

  const renderNewBulkFooter = () => {
    const handleStartNewBulkEdit = () => {
      setVisibleColumns(null);
      // redirect to initial state with saved capabilities in search
      history.replace({
        pathname: '/bulk-edit',
      });
    };

    return newBulkFooterShown ? (
      <PaneFooter
        renderEnd={(
          <Button onClick={handleStartNewBulkEdit} buttonStyle="primary mega">
            <FormattedMessage id="ui-bulk-edit.start.newBulkEdit" />
          </Button>
        )}
      />
    ) : null;
  };

  return (
    <RootContext.Provider value={{
      setNewBulkFooterShown,
      countOfRecords,
      setCountOfRecords,
      visibleColumns,
      setVisibleColumns,
      confirmedFileName,
    }}
    >
      <Paneset>
        {/* FILTERS PANE */}
        <Pane
          defaultWidth="20%"
          paneTitle={<FormattedMessage id="ui-bulk-edit.list.criteriaTitle" />}
        >
          <BulkEditListFilters
            filters={filters}
            setFilters={setFilters}
            setIsFileUploaded={setIsFileUploaded}
            isFileUploaded={isFileUploaded}
            setVisibleColumns={setVisibleColumns}
          />
        </Pane>

        {/* RESULT PANES */}
        {
          isLogsTab && <BulkEditLogs />
        }
        {
          !isLogsTab && (
            <Pane
              {...defaultPaneProps}
              actionMenu={actionMenu}
              footer={renderNewBulkFooter()}
            >
              <BulkEditListResult />
            </Pane>
          )
        }

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

        <BulkEditInAppPreviewModal
          bulkOperationId={bulkOperationId}
          open={isPreviewModalOpened}
          contentUpdates={contentUpdates}
          onKeepEditing={handlePreviewModalClose}
          onChangesCommited={handleChangesCommited}
        />
      </Paneset>

      <BulkEditManualUploadModal
        operationId={bulkOperationId}
        identifier={filters.recordIdentifier}
        open={isBulkEditModalOpen}
        onCancel={cancelBulkEditStart}
        countOfRecords={countOfRecords}
        setCountOfRecords={setCountOfRecords}
      />

    </RootContext.Provider>
  );
};
