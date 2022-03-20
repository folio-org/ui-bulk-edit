import { AppIcon } from '@folio/stripes/core';
import { FormattedMessage } from 'react-intl';
import { FormattedTime } from './FormattedTime';

export const getUserResultsFormatter = (userGroups) => ({
  active: user => (
    <AppIcon app="users" size="small">
      {user.active
        ? <FormattedMessage id="ui-bulk-edit.list.preview.table.active" />
        : <FormattedMessage id="ui-bulk-edit.list.preview.table.inactive" />
        }
    </AppIcon>
  ),
  lastName: user => user.personal?.lastName,
  firstName: user => user.personal?.firstName,
  barcode: user => user.barcode,
  patronGroup: user => userGroups[user.patronGroup],
  username: user => user.username,
  email: user => user.personal.email,
  expirationDate: user => <FormattedTime dateString={user.expirationDate} />,
});


export const getInventoryResultsFormatter = () => ({
  status: item => item.status,
  effectiveLocation: item => item.effectiveLocation,
  callNumber: item => item.callNumber,
  hrid: item => item.hrid,
  materialType: item => item.materialType,
  permanentLoanType: item => item.permanentLoanType,
  temporaryLoanType: item => item.temporaryLoanType,
  id: item => item.id,
  formerIds: item => item.formerIds?.join(','),
  accessionNumber: item => item.accessionNumber,
  permanentLocation: item => item.permanentLocation,
  temporaryLocation: item => item.temporaryLocation,
  copyNumber: item => item.copyNumber,
  enumeration: item => item.enumeration,
  chronology: item => item.chronology,
  volume: item => item.volume,
});

export const userColumnMappings = {
  active: <FormattedMessage id="ui-bulk-edit.list.preview.table.status" />,
  lastName: <FormattedMessage id="ui-bulk-edit.list.preview.table.lastName" />,
  firstName: <FormattedMessage id="ui-bulk-edit.list.preview.table.firstName" />,
  barcode: <FormattedMessage id="ui-bulk-edit.list.preview.table.barcode" />,
  patronGroup: <FormattedMessage id="ui-bulk-edit.list.preview.table.patronGroup" />,
  username: <FormattedMessage id="ui-bulk-edit.list.preview.table.username" />,
  email: <FormattedMessage id="ui-bulk-edit.list.preview.table.email" />,
  expirationDate: <FormattedMessage id="ui-bulk-edit.list.preview.table.expirationDate" />,
};
