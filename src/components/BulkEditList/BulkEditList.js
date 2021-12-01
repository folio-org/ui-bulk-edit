import { FormattedMessage } from 'react-intl';

import { Pane, Paneset } from '@folio/stripes/components';
import { AppIcon, useStripes } from '@folio/stripes/core';

import { noop } from 'lodash/util';
import { BulkEditListFilters } from './BulkEditListFilters/BulkEditListFilters';
import { BulkEditListResult } from './BulkEditListResult/BulkEditListResult';
import { BulkEditActionMenu } from '../BulkEditActionMenu/BulkEditActionMenu';

export const BulkEditList = () => {
  const stripes = useStripes();
  const hasEditOrDeletePerms = stripes.hasPerm('ui-bulk-edit.edit') || stripes.hasPerm('ui-bulk-edit.delete');


  const renderActionMenu = () => (
    hasEditOrDeletePerms && (
    <BulkEditActionMenu
      onEdit={noop}
      onDelete={noop}
      onToggle={noop}
    />
    )
  );

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
        actionMenu={renderActionMenu}
      >
        <BulkEditListResult />
      </Pane>
    </Paneset>
  );
};
