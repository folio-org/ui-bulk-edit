import { FormattedMessage } from 'react-intl';

import { Pane, Paneset } from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';
import { BulkEditListFilters } from './BulkEditListFilters/BulkEditListFilters';
import { BulkEditListResult } from './BulkEditListResult/BulkEditListResult';

export const BulkEditList = () => {
  return (
    <Paneset>
      <Pane
        defaultWidth="20%"
        paneTitle={<FormattedMessage id="ui-bulk-edit.list.criteriaTitle" />}
      >
        <BulkEditListFilters />
      </Pane>
      <Pane
        defaultWidth="fill"
        paneTitle={<FormattedMessage id="ui-bulk-edit.meta.title" />}
        paneSub={<FormattedMessage id="ui-bulk-edit.list.logSubTitle" />}
        appIcon={<AppIcon app="bulk-edit" iconKey="app" />}
      >
        <BulkEditListResult />
      </Pane>
    </Paneset>
  );
};
