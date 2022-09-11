import { AppIcon } from '@folio/stripes/core';
import { FormattedMessage } from 'react-intl';
import { FormattedTime } from '../components/BulkEditList/BulkEditListResult/Preview/PreviewAccordion/FormattedTime';

export const getUserResultsFormatterBase = (userGroups) => ({
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
});

export const getUserResultsFormatter = (userGroups) => ({
  ...getUserResultsFormatterBase(userGroups),
  email: user => user.personal.email,
  expirationDate: user => <FormattedTime dateString={user.expirationDate} />,
});

export const getInventoryResultsFormatterBase = () => ({
  barcode: item => item.barcode,
  status: item => item.status.name ?? '',
  effectiveLocation: item => item.effectiveLocation?.name || '',
  callNumber: item => item.callNumber,
  hrid: item => item.hrid,
  materialType: item => item.materialType?.name || '',
  permanentLoanType: item => item.permanentLoanType?.name || '',
  temporaryLoanType: item => item.temporaryLoanType?.name || '',
});

export const getInventoryResultsFormatter = () => ({
  ...getInventoryResultsFormatterBase(),
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

export const getHoldingsResultsFormatter = () => ({
  hrid: item => item.hrid,
  permanentLocation: item => item.permanentLocation,
  temporaryLocation: item => item.temporaryLocation,
  callNumberPrefix: item => item.callNumberPrefix,
  callNumber: item => item.callNumber,
  callNumberSuffix: item => item.callNumberSuffix,
  holdingsTypeId: item => item.holdingsTypeId,

  effectiveLocation: item => item.effectiveLocation,
  id: item => item.id,
  sourceId: item => item.sourceId,
  discoverySuppress: item => item.discoverySuppress?.name || '',
  callNumberTypeId: item => item.callNumberTypeId,
});
