import { useMemo, useState, useEffect, useCallback } from 'react';
import { FormattedMessage } from 'react-intl';

import { Pane, Paneset } from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';
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
import { useBulkPermissions } from '../../hooks/bulkPermissions';

export const BulkEditList = () => {
  const location = useLocation();
  const [fileUploadedMatchedName, setFileUploadedMatchedName] = useState();
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
  const [isBulkEditConformationModal, setIsBulkConformationModal] = useState(false);
  const [countOfRecords, setCountOfRecords] = useState(0);
  const [updatedId, setUpdatedId] = useState();

  const { id } = usePathParams('/bulk-edit/:id');
  const { data, isLoading, refetch } = useDownloadLinks(id);
  const { startJob } = useLaunchJob(id);
  const [successCsvLink, errorCsvLink] = data?.files || [];
  const { isActionMenuShown } = useBulkPermissions();

  const isActionMenuVisible = successCsvLink || errorCsvLink || isActionMenuShown;

  const runJob = useCallback(() => startJob({ id }), [id]);

  useEffect(() => {
    const capabilities = new URLSearchParams(location.search).get('capabilities');

    if (!isLoading && id && capabilities === CAPABILITIES.ITEM) {
      runJob().finally(() => refetch());
    }
  }, [id, isLoading, location.search]);

  const renderActionMenu = () => (
    isActionMenuVisible && (
      <BulkEditActionMenu
        onEdit={() => setIsBulkEditModalOpen(true)}
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
