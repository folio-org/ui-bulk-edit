import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { Pane, Paneset } from '@folio/stripes/components';
import { AppIcon, useStripes } from '@folio/stripes/core';
import { noop } from 'lodash/util';

import { BulkEditListFilters } from './BulkEditListFilters/BulkEditListFilters';
import { BulkEditListResult } from './BulkEditListResult/BulkEditListResult';
import { BulkEditActionMenu } from '../BulkEditActionMenu';
import { BulkEditStartModal } from '../BulkEditStartModal';
import { BulkEditConformationModal } from '../BulkEditConformationModal';
import { useProgressStatus } from '../../API/useDownloadLinks';

export const BulkEditList = () => {
  const stripes = useStripes();
  const [fileUploadedName, setFileUploadedName] = useState();
  const [fileUploadedMatchedName, setFileUploadedMatchedName] = useState();
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);
  const [isBulkEditConformationModal, setIsBulkConformationModal] = useState(false);
  const [countOfRecords, setCountOfRecords] = useState(0);
  const [updatedId, setUpdatedId] = useState();
  const [refetchInterval, setRefetchInterval] = useState(500);

  const { data } = useProgressStatus(updatedId, refetchInterval, setRefetchInterval);

  const hasEditOrDeletePerms = stripes.hasPerm('ui-bulk-edit.edit') || stripes.hasPerm('ui-bulk-edit.delete');

  const renderActionMenu = () => (
    hasEditOrDeletePerms && (
    <BulkEditActionMenu
      onEdit={() => setIsBulkEditModalOpen(true)}
      onDelete={noop}
      onToggle={noop}
    />
    )
  );

  const cancelBulkEditStart = () => {
    setIsBulkEditModalOpen(false);
  };

  const paneTitle = fileUploadedName ?
    <FormattedMessage
      id="ui-bulk-edit.meta.title.uploadedFile"
      values={{ fileName: fileUploadedName }}
    />
    : fileUploadedMatchedName ?
      <FormattedMessage
        id="ui-bulk-edit.meta.title.uploadedFile"
        values={{ fileName: fileUploadedMatchedName }}
      /> :
      <FormattedMessage id="ui-bulk-edit.meta.title" />;

  return (
    <>
      <Paneset>
        <Pane
          defaultWidth="20%"
          paneTitle={<FormattedMessage id="ui-bulk-edit.list.criteriaTitle" />}
        >
          <BulkEditListFilters
            setFileUploadedName={setFileUploadedName}
            setIsFileUploaded={setIsFileUploaded}
            isFileUploaded={isFileUploaded}
          />
        </Pane>
        <Pane
          defaultWidth="fill"
          paneTitle={paneTitle}
          paneSub={<FormattedMessage id="ui-bulk-edit.list.logSubTitle" />}
          appIcon={<AppIcon app="bulk-edit" iconKey="app" />}
          actionMenu={renderActionMenu}
        >
          <BulkEditListResult
            fileUploadedName={fileUploadedName}
            fileUpdatedName={fileUploadedMatchedName}
            progress={data?.progress?.progress}
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
