import { useMemo, useState, useEffect, useRef } from 'react';
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

import { useLocation } from 'react-router-dom';
import { useHistory } from 'react-router';
import { useQueryClient } from 'react-query';
import { buildSearch } from '@folio/stripes-acq-components';
import { BulkEditListFilters } from './BulkEditListFilters/BulkEditListFilters';
import { BulkEditListResult } from './BulkEditListResult';
import { BulkEditActionMenu } from '../BulkEditActionMenu';
import { BulkEditStartModal } from '../BulkEditStartModal';
import { BulkEditConformationModal } from '../modals/BulkEditConformationModal';
import { useJob } from '../../API';
import { usePathParams } from '../../hooks';
import { CAPABILITIES, CRITERIES } from '../../constants';
import { BulkEditInApp } from './BulkEditListResult/BulkEditInApp/BulkEditInApp';
import PreviewModal from '../modals/PreviewModal/PreviewModal';
import { useBulkPermissions } from '../../hooks/useBulkPermissions';
import { RootContext } from '../../context/RootContext';
import { useFormValid } from '../../hooks/useFormValid';


export const BulkEditList = () => {
  const queryClient = useQueryClient();
  const location = useLocation();
  const history = useHistory();
  const search = new URLSearchParams(location.search);
  const controller = useRef();

  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
  const [isBulkEditLayerOpen, setIsBulkEditLayerOpen] = useState(false);
  const [isBulkEditConformationModal, setIsBulkConformationModal] = useState(false);
  const [countOfRecords, setCountOfRecords] = useState(0);
  const [updatedId, setUpdatedId] = useState();
  const [isPreviewModalOpened, setPreviewModalOpened] = useState(false);
  const [contentUpdates, setContentUpdates] = useState(null);
  const [newBulkFooterShown, setNewBulkFooterShown] = useState(false);
  const [visibleColumns, setVisibleColumns] = useState(null);
  const [processedFileName, setProcessedFileName] = useState(null);
  const [confirmedFileName, setConfirmedFileName] = useState(null);

  const { isInAppFormValid } = useFormValid(contentUpdates);

  const { id: jobId } = usePathParams('/bulk-edit/:id');
  const { data, isLoading } = useJob(jobId);

  const [successCsvLink, errorCsvLink] = data?.files || [];
  const { isActionMenuShown, hasOnlyInAppViewPerms } = useBulkPermissions();

  const capabilitiesUrl = search.get('capabilities');

  const getDefaultCapabilities = () => {
    if (hasOnlyInAppViewPerms) {
      return CAPABILITIES.ITEM;
    }

    return capabilitiesUrl || CAPABILITIES.USER;
  };

  const defaultCapability = getDefaultCapabilities();

  const initialFiltersState = {
    criteria: CRITERIES.IDENTIFIER,
    capabilities: defaultCapability,
    queryText: '',
    recordIdentifier: '',
  };

  const [filters, setFilters] = useState(initialFiltersState);

  const handleStartBulkEdit = () => {
    if (capabilitiesUrl === CAPABILITIES.ITEM || capabilitiesUrl === CAPABILITIES.HOLDINGS) {
      setIsBulkEditLayerOpen(true);
    } else setIsBulkEditModalOpen(true);
  };

  const isActionMenuVisible = successCsvLink || errorCsvLink || isActionMenuShown;

  useEffect(() => {
    const columns = localStorage.getItem('visibleColumns');

    if (columns) {
      setVisibleColumns(columns);
    }
  }, []);

  useEffect(() => {
    const initialRoute = '/bulk-edit';

    if (location.pathname === initialRoute && !location.search) {
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
        search: buildSearch({ capabilities: getDefaultCapabilities() }),
      });

      setNewBulkFooterShown(false);
    }
  }, [location.pathname, location.search]);

  const renderActionMenu = () => (
    isActionMenuVisible && (
      <BulkEditActionMenu
        onEdit={handleStartBulkEdit}
        onToggle={noop}
        successCsvLink={successCsvLink}
        errorCsvLink={errorCsvLink}
        isLoading={isLoading}
        onUserEdit={() => setIsBulkEditLayerOpen(true)}
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

  const handleBulkEditLayerClose = () => {
    setIsBulkEditLayerOpen(false);
  };

  const handlePreviewModalOpen = () => {
    controller.current = new AbortController();
    setPreviewModalOpened(true);
  };

  const handleJobStart = () => {
    setPreviewModalOpened(false);
    setIsBulkEditLayerOpen(false);
  };

  const handleOnKeepEditing = () => {
    if (controller.current) controller.current.abort();
    setPreviewModalOpened(false);
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
    } else return <FormattedMessage id="ui-bulk-edit.meta.title" />;
  }, [confirmedFileName, location.search]);

  const changedPaneSubTitle = useMemo(() => (
    history.location.pathname === `/bulk-edit/${jobId}/initial` ?
      <FormattedMessage id="ui-bulk-edit.list.logSubTitle.matched" values={{ count: countOfRecords }} />
      : <FormattedMessage id="ui-bulk-edit.list.logSubTitle.changed" values={{ count: countOfRecords }} />
  ), [countOfRecords, history.location.pathname]);

  const paneSubtitle = useMemo(() => (
    history.location.pathname !== '/bulk-edit' && history.location.pathname !== `/bulk-edit/${jobId}/initialProgress`
      ?
      changedPaneSubTitle
      : <FormattedMessage id="ui-bulk-edit.list.logSubTitle" />
  ), [changedPaneSubTitle, history.location.pathname]);

  const fileNameTitle = () => {
    const fileUploadedName = search.get('fileName');

    return <FormattedMessage
      id="ui-bulk-edit.preview.file.title"
      values={{ fileUploadedName }}
           />;
  };

  const renderNewBulkFooter = newBulkFooterShown
    ? <PaneFooter renderEnd={<Button onClick={handleStartNewBulkEdit} buttonStyle="primary mega"><FormattedMessage id="ui-bulk-edit.start.newBulkEdit" /></Button>} />
    : null;

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
            disabled={!isInAppFormValid}
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
          footer={renderNewBulkFooter}
        >
          <BulkEditListResult
            updatedId={updatedId}
            jobId={jobId}
            setCountOfRecords={setCountOfRecords}
          />
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
              typeOfBulk={capabilitiesUrl}
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
        setUpdatedId={setUpdatedId}
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
        updatedId={updatedId}
      />
      <PreviewModal
        jobId={jobId}
        open={isPreviewModalOpened}
        contentUpdates={contentUpdates}
        onJobStarted={handleJobStart}
        onKeepEditing={handleOnKeepEditing}
        setUpdatedId={setUpdatedId}
        controller={controller.current}
      />

    </RootContext.Provider>
  );
};
