import { useMemo, useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Pane,
  Paneset,
  Layer,
  PaneFooter,
  Button,
} from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';
import { noop } from 'lodash/util';

import { useHistory } from 'react-router';
import { useQueryClient } from 'react-query';
import { buildSearch } from '@folio/stripes-acq-components';
import { BulkEditListFilters } from './BulkEditListFilters/BulkEditListFilters';
import { BulkEditListResult } from './BulkEditListResult';
import { BulkEditActionMenu } from '../BulkEditActionMenu';
import { BulkEditStartModal } from '../BulkEditStartModal';
import { BulkEditConformationModal } from '../modals/BulkEditConformationModal';
import { usePathParams, useBulkPermissions } from '../../hooks';
import { CAPABILITIES, CRITERIA, APPROACHES } from '../../constants';
import { BulkEditInApp } from './BulkEditListResult/BulkEditInApp/BulkEditInApp';
import PreviewModal from '../modals/PreviewModal/PreviewModal';

import { RootContext } from '../../context/RootContext';
import BulkEditLogs from '../BulkEditLogs/BulkEditLogs';
import { isContentUpdatesFormValid } from './BulkEditListResult/BulkEditInApp/ContentUpdatesForm/helpers';


export const BulkEditList = () => {
  const queryClient = useQueryClient();
  const history = useHistory();
  const search = new URLSearchParams(history.location.search);

  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
  const [isBulkEditLayerOpen, setIsBulkEditLayerOpen] = useState(false);
  const [isBulkEditConformationModal, setIsBulkConformationModal] = useState(false);
  const [countOfRecords, setCountOfRecords] = useState(0);
  const [isPreviewModalOpened, setPreviewModalOpened] = useState(false);
  const [contentUpdates, setContentUpdates] = useState(null);
  const [newBulkFooterShown, setNewBulkFooterShown] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(null);
  const [processedFileName, setProcessedFileName] = useState(null);
  const [confirmedFileName, setConfirmedFileName] = useState(null);


  const { id: bulkOperationId } = usePathParams('/bulk-edit/:id');

  const { isActionMenuShown, hasOnlyInAppViewPerms, hasInAppEditPerms } = useBulkPermissions();

  const capabilities = search.get('capabilities');
  const criteria = search.get('criteria');

  const getDefaultCapabilities = () => {
    if (hasOnlyInAppViewPerms || hasInAppEditPerms) {
      return capabilities || CAPABILITIES.ITEM;
    }

    return capabilities || CAPABILITIES.USER;
  };

  const defaultCapability = getDefaultCapabilities();

  const initialFiltersState = {
    criteria: CRITERIA.IDENTIFIER,
    capabilities: defaultCapability,
    queryText: '',
    recordIdentifier: '',
  };

  const [filters, setFilters] = useState(initialFiltersState);

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

    if (approach === APPROACHES.CSV) {
      setIsBulkEditModalOpen(true);
    }
  };

  const isLogsTab = criteria === CRITERIA.LOGS;
  const isActionMenuVisible = isActionMenuShown && !isLogsTab;

  useEffect(() => {
    const initialRoute = '/bulk-edit';

    if (history.location.pathname === initialRoute && !history.location.search) {
      // reset count of records
      setCountOfRecords(0);

      // reset filters
      setFilters(initialFiltersState);

      // clear job information
      queryClient.setQueryData('getJob', () => ({ data: undefined }));

      // reset confirmed file name
      setConfirmedFileName(null);

      // clear visibleColumns preset
      localStorage.removeItem('visibleColumns');
      setVisibleColumns(null);

      // set user capability by default
      history.replace({
        search: buildSearch({ capabilities: getDefaultCapabilities(), criteria: CRITERIA.IDENTIFIER }),
      });

      setNewBulkFooterShown(false);
    }
  }, [history.location]);

  const renderActionMenu = () => (
    isActionMenuVisible && (
      <BulkEditActionMenu
        onEdit={handleStartBulkEdit}
        onToggle={noop}
      />
    )
  );

  const cancelBulkEditStart = () => {
    setIsBulkEditModalOpen(false);

    // remove data from url, only in case if there is no confirmed file
    if (!confirmedFileName) {
      search.delete('processedFileName');

      const searchStr = `?${search.toString()}`;

      history.replace({
        search: buildSearch({}, searchStr),
      });
    }
  };



  const handleStartNewBulkEdit = () => {
    // redirect to initial state with saved capabilities in search
    history.replace({
      pathname: '/bulk-edit',
    });
  };

  const paneTitle = useMemo(() => {
    const fileUploadedName = search.get('fileName');

    if (confirmedFileName || fileUploadedName) {
      return <FormattedMessage
        id="ui-bulk-edit.meta.title.uploadedFile"
        values={{ fileName: confirmedFileName || fileUploadedName }}
             />;
    } else if (criteria === CRITERIA.LOGS) {
      return <FormattedMessage id="ui-bulk-edit.meta.logs.title" />;
    } else return <FormattedMessage id="ui-bulk-edit.meta.title" />;
  }, [confirmedFileName, history.location.search]);

  const changedPaneSubTitle = useMemo(() => (
    history.location.pathname === `/bulk-edit/${bulkOperationId}/initial` ?
      <FormattedMessage id="ui-bulk-edit.list.logSubTitle.matched" values={{ count: countOfRecords }} />
      : <FormattedMessage id="ui-bulk-edit.list.logSubTitle.changed" values={{ count: countOfRecords }} />
  ), [countOfRecords, history.location.pathname]);

  const defaultPaneSubtitle = useMemo(() => (
    criteria === CRITERIA.LOGS ?
      <FormattedMessage id="ui-bulk-edit.logs.logSubTitle" />
      :
      <FormattedMessage id="ui-bulk-edit.list.logSubTitle" />
  ), [history.location.search]);

  const paneSubtitle = useMemo(() => (
    history.location.pathname !== '/bulk-edit' && history.location.pathname !== `/bulk-edit/${bulkOperationId}/progress`
      ?
      changedPaneSubTitle
      : defaultPaneSubtitle
  ), [changedPaneSubTitle, history.location.pathname, defaultPaneSubtitle]);

  const fileNameTitle = () => {
    const fileUploadedName = search.get('fileName');

    return <FormattedMessage
      id="ui-bulk-edit.preview.file.title"
      values={{ fileUploadedName }}
           />;
  };

  const renderNewBulkFooter = () => (newBulkFooterShown ? (
    <PaneFooter
      renderEnd={(
        <Button onClick={handleStartNewBulkEdit} buttonStyle="primary mega">
          <FormattedMessage id="ui-bulk-edit.start.newBulkEdit" />
        </Button>
      )}
    />
  ) : null);

  const renderPaneFooter = () => {
    return (
      <PaneFooter
        renderStart={(
          <Button
            buttonStyle="default mega"
            id="clickable-cancel"
            marginBottom0
            onClick={handleBulkEditLayerClose}
          >
            <FormattedMessage id="stripes-components.cancel" />
          </Button>
        )}
        renderEnd={(
          <Button
            buttonStyle="primary mega"
            id="clickable-create-widget"
            marginBottom0
            onClick={handlePreviewModalOpen}
            type="submit"
            disabled={!isContentUpdatesFormValid(contentUpdates)}
          >
            <FormattedMessage id="ui-bulk-edit.layer.confirmChanges" />
          </Button>
        )}
      />
    );
  };

  return (
    <RootContext.Provider value={{
      setNewBulkFooterShown,
      setCountOfRecords,
      visibleColumns,
      setVisibleColumns,
      confirmedFileName,
    }}
    >
      <Paneset>
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
        <Pane
          defaultWidth="fill"
          paneTitle={paneTitle}
          paneSub={paneSubtitle}
          appIcon={<AppIcon app="bulk-edit" iconKey="app" />}
          actionMenu={renderActionMenu}
          footer={renderNewBulkFooter()}
        >
          {criteria === CRITERIA.LOGS ? <BulkEditLogs /> : <BulkEditListResult />}
        </Pane>
        <Layer isOpen={isBulkEditLayerOpen} inRootSet>
          <Pane
            defaultWidth="fill"
            paneTitle={paneTitle}
            paneSub={paneSubtitle}
            footer={renderPaneFooter()}
            appIcon={<AppIcon app="bulk-edit" iconKey="app" />}
            dismissible
            onClose={() => setIsBulkEditLayerOpen(false)}
          >
            <BulkEditInApp
              title={fileNameTitle()}
              onContentUpdatesChanged={setContentUpdates}
              capabilities={capabilities}
            />
          </Pane>
        </Layer>
      </Paneset>
      <BulkEditStartModal
        fileName={processedFileName}
        setFileName={setProcessedFileName}
        open={isBulkEditModalOpen}
        onCancel={cancelBulkEditStart}
        setIsBulkConformationModal={setIsBulkConformationModal}
        setCountOfRecords={setCountOfRecords}
        setIsBulkEditModalOpen={setIsBulkEditModalOpen}
      />
      <BulkEditConformationModal
        onCancel={cancelBulkEditStart}
        setConfirmedFileName={setConfirmedFileName}
        setProcessedFileName={setProcessedFileName}
        open={isBulkEditConformationModal}
        setIsBulkConformationModal={setIsBulkConformationModal}
        fileName={processedFileName}
        countOfRecords={countOfRecords}
      />
      <PreviewModal
        bulkOperationId={bulkOperationId}
        open={isPreviewModalOpened}
        contentUpdates={contentUpdates}
        onKeepEditing={handlePreviewModalClose}
        onChangesCommited={handleChangesCommited}
      />

    </RootContext.Provider>
  );
};
