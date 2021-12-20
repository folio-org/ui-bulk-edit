import { FormattedMessage } from 'react-intl';
import { MultiColumnList } from '@folio/stripes/components';
import { AppIcon } from '@folio/stripes/core';

import { usePreviewRecords } from '../../../../API';
import { usePathParams } from '../../../../hooks';

export const PreviewList = () => {
  const { id } = usePathParams('/bulk-edit/:id');
  const { users } = usePreviewRecords(id);

  const resultsFormatter = {
    active: user => (
      <AppIcon app="users" size="small">
        {
        user.active
          ? <FormattedMessage id="ui-bulk-edit.list.preview.table.active" />
          : <FormattedMessage id="ui-bulk-edit.list.preview.table.inactive" />
        }
      </AppIcon>
    ),
    lastName: user => user.personal.lastName,
    firstName: user => user.personal.firstName,
    barcode: user => user.barcode,
    patronGroup: user => user.patronGroup,
    username: user => user.username,
  };
  const columnMapping = {
    active: <FormattedMessage id="ui-bulk-edit.list.preview.table.status" />,
    lastName: <FormattedMessage id="ui-bulk-edit.list.preview.table.lastName" />,
    firstName: <FormattedMessage id="ui-bulk-edit.list.preview.table.firstName" />,
    barcode: <FormattedMessage id="ui-bulk-edit.list.preview.table.barcode" />,
    patronGroup: <FormattedMessage id="ui-bulk-edit.list.preview.table.patronGroup" />,
    username: <FormattedMessage id="ui-bulk-edit.list.preview.table.username" />,
  };
  const visibleColumns = ['active', 'lastName', 'firstName', 'barcode', 'patronGroup', 'username'];

  return (
    <MultiColumnList
      striped
      contentData={users}
      columnMapping={columnMapping}
      formatter={resultsFormatter}
      visibleColumns={visibleColumns}
    />
  );
};
