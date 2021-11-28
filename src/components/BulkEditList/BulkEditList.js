import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

import { Pane, Paneset } from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';

import { BulkEditListFilters } from './BulkEditListFilters/BulkEditListFilters';
import { BulkEditListResult } from './BulkEditListResult/BulkEditListResult';

export const BulkEditList = () => {
  const [fileUploadedName, setFileUploadedName] = useState();
  const [isFileUploaded, setIsFileUploaded] = useState(false);

  return (
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
        paneTitle={isFileUploaded ?
          <FormattedMessage
            id="ui-bulk-edit.meta.title.uploadedFile"
            values={{ fileName: fileUploadedName }}
          />
          :
          <FormattedMessage id="ui-bulk-edit.meta.title" />}
        paneSub={<FormattedMessage id="ui-bulk-edit.list.logSubTitle" />}
        appIcon={<AppIcon app="bulk-edit" iconKey="app" />}
      >
        <BulkEditListResult
          fileUploadedName={fileUploadedName}
        />
      </Pane>
    </Paneset>
  );
};
