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
  barcode: item => item.barcode,
  status: item => item.status.name ?? '',
  effectiveLocation: item => item.effectiveLocation?.name || '',
  callNumber: item => item.callNumber,
  hrid: item => item.hrid,
  materialType: item => item.materialType?.name || '',
  permanentLoanType: item => item.permanentLoanType?.name || '',
  temporaryLoanType: item => item.temporaryLoanType?.name || '',
  id: item => item.id,
  formerIds: item => item.formerIds?.join(','),
  accessionNumber: item => item.accessionNumber,
  permanentLocation: item => item.permanentLocation?.name || '',
  temporaryLocation: item => item.temporaryLocation?.name || '',
  copyNumber: item => item.copyNumber,
  enumeration: item => item.enumeration,
  chronology: item => item.chronology,
  volume: item => item.volume,
});
