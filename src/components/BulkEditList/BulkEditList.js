import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { Pane, Paneset } from '@folio/stripes/components';
import { AppIcon, useStripes } from '@folio/stripes/core';
import { noop } from 'lodash/util';

import { BulkEditListFilters } from './BulkEditListFilters/BulkEditListFilters';
import { BulkEditListResult } from './BulkEditListResult/BulkEditListResult';
import { BulkEditActionMenu } from '../BulkEditActionMenu';
import { BulkEditStartModal } from '../BulkEditStartModal';

export const BulkEditList = () => {
  const stripes = useStripes();
  const [fileUploadedName, setFileUploadedName] = useState();
  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [isBulkEditModalOpen, setIsBulkEditModalOpen] = useState(false);

  const hasEditOrDeletePerms = stripes.hasPerm('ui-bulk-edit.edit') || stripes.hasPerm('ui-bulk-edit.delete');

  const renderActionMenu = () => (
    // hasEditOrDeletePerms && (
    <BulkEditActionMenu
      onEdit={() => setIsBulkEditModalOpen(true)}
      onDelete={noop}
      onToggle={noop}
    />
    // )
  );

  const cancelBulkEditStart = () => {
    setIsBulkEditModalOpen(false);
  };

  const paneTitle = fileUploadedName ?
    <FormattedMessage
      id="ui-bulk-edit.meta.title.uploadedFile"
      values={{ fileName: fileUploadedName }}
    />
    :
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
          />
        </Pane>
      </Paneset>
      <BulkEditStartModal
        open={isBulkEditModalOpen}
        onCancel={cancelBulkEditStart}
      />
    </>
  );
};
