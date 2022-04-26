import { useMemo, useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

import { Pane, Paneset, Layer, PaneFooter, Button } from '@folio/stripes/components';
import { AppIcon, useStripes } from '@folio/stripes/core';
import { noop } from 'lodash/util';

import { useLocation } from 'react-router-dom';
import { BulkEditListFilters } from './BulkEditListFilters/BulkEditListFilters';
import { BulkEditListResult } from './BulkEditListResult';
import { BulkEditActionMenu } from '../BulkEditActionMenu';
import { BulkEditStartModal } from '../BulkEditStartModal';
import { BulkEditConformationModal } from '../BulkEditConformationModal';
import { useDownloadLinks, useLaunchJob } from '../../API';
import { usePathParams } from '../../hooks';
import { CAPABILITIES } from '../../constants';
import { BulkEditInApp } from './BulkEditListResult/BulkEditInApp/BulkEditInApp';

export const BulkEditList = () => {
  const stripes = useStripes();
  const location = useLocation();
  const [fileUploadedMatchedName, setFileUploadedMatchedName] = useState();
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
  const [isBulkEditLayerOpen, setIsBulkEditLayerOpen] = useState(false);
  const [isBulkEditConformationModal, setIsBulkConformationModal] = useState(false);
  const [countOfRecords, setCountOfRecords] = useState(0);
  const [updatedId, setUpdatedId] = useState();

  const { id } = usePathParams('/bulk-edit/:id');
  const { data, isLoading } = useDownloadLinks(id);
  const { startJob } = useLaunchJob(id);
  const [successCsvLink, errorCsvLink] = data?.files || [];
  const hasEditOrDeletePerms = stripes.hasPerm('ui-bulk-edit.edit') || stripes.hasPerm('ui-bulk-edit.delete');
  const hasEditPermsInApp = stripes.hasPerm('ui-bulk-edit.app-edit');
  const hasViewCSVPerms = stripes.hasPerm('ui-bulk-edit.view');

  const isActionMenuVisible = (successCsvLink || errorCsvLink) || // should show menu in case of existing preview/errors in any case
      (hasEditOrDeletePerms && !hasEditPermsInApp) || !hasViewCSVPerms;
  const capabilities = new URLSearchParams(location.search).get('capabilities');
  const handleStartBulkEdit = () => {
    if (capabilities === CAPABILITIES.ITEM) {
      setIsBulkEditLayerOpen(true);
    } else setIsBulkEditModalOpen(true);
  };

  useEffect(() => {
    if (!isLoading && id && capabilities === CAPABILITIES.ITEM) { startJob({ id }); }
  }, [startJob, id, isLoading, location.search]);

  const renderActionMenu = () => (
    isActionMenuVisible && (
      <BulkEditActionMenu
        onEdit={handleStartBulkEdit}
        onToggle={noop}
        successCsvLink={successCsvLink}
        errorCsvLink={errorCsvLink}
        isLoading={isLoading}
      />
    )
  );

  const cancelBulkEditStart = () => {
    setIsBulkEditModalOpen(false);
  };

  const handleClickLayerFooter = () => {
    setIsBulkEditLayerOpen(false);
  };

  const paneTitle = useMemo(() => {
    const fileUploadedName = new URLSearchParams(location.search).get('fileName');

    if (fileUploadedMatchedName || fileUploadedName) {
      return <FormattedMessage
        id="ui-bulk-edit.meta.title.uploadedFile"
        values={{ fileName: fileUploadedMatchedName || fileUploadedName }}
             />;
    } else return <FormattedMessage id="ui-bulk-edit.meta.title" />;
  }, [fileUploadedMatchedName, location.search]);

  const paneSubtitle = useMemo(() => (
    countOfRecords
      ? <FormattedMessage id="ui-bulk-edit.list.logSubTitle.matched" values={{ count: countOfRecords }} />
      : <FormattedMessage id="ui-bulk-edit.list.logSubTitle" />
  ), [countOfRecords]);

  const fileNameTitle = () => {
    const fileUploadedName = new URLSearchParams(location.search).get('fileName');

    return <FormattedMessage
      id="ui-bulk-edit.preview.file.title"
      values={{ fileUploadedName }}
           />;
  };

  const renderPaneFooter = () => {
    return (
      <PaneFooter
        renderEnd={(
          <Button
            buttonStyle="primary mega"
            id="clickable-create-widget"
            marginBottom0
            onClick={handleClickLayerFooter}
            type="submit"
          >
            <FormattedMessage id="stripes-components.saveAndClose" />
          </Button>
        )}
        renderStart={(
          <Button
            buttonStyle="default mega"
            id="clickable-cancel"
            marginBottom0
            onClick={handleClickLayerFooter}
          >
            <FormattedMessage id="stripes-components.cancel" />
          </Button>
        )}
      />
    );
  };

  return (
    <>
      <Paneset>
        <Pane
          defaultWidth="20%"
          paneTitle={<FormattedMessage id="ui-bulk-edit.list.criteriaTitle" />}
        >
          <BulkEditListFilters
            setIsFileUploaded={setIsFileUploaded}
            isFileUploaded={isFileUploaded}
            setCountOfRecords={setCountOfRecords}
          />
        </Pane>
        <Pane
          defaultWidth="fill"
          paneTitle={paneTitle}
          paneSub={paneSubtitle}
          appIcon={<AppIcon app="bulk-edit" iconKey="app" />}
          actionMenu={renderActionMenu}
        >
          <BulkEditListResult
            updatedId={updatedId}
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
            <BulkEditInApp title={fileNameTitle()} />
          </Pane>
        </Layer>
      </Paneset>
      <BulkEditStartModal
        setFileName={setFileUploadedMatchedName}
        open={isBulkEditModalOpen}
        onCancel={cancelBulkEditStart}
        setIsBulkConformationModal={setIsBulkConformationModal}
        setCountOfRecords={setCountOfRecords}
        setUpdatedId={setUpdatedId}
      />
      <BulkEditConformationModal
        open={isBulkEditConformationModal}
        setIsBulkConformationModal={setIsBulkConformationModal}
        fileName={fileUploadedMatchedName}
        countOfRecords={countOfRecords}
        updatedId={updatedId}
      />

    </>
  );
};
