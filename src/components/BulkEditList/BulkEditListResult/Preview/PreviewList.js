import { FormattedMessage } from 'react-intl';
import { MultiColumnList } from '@folio/stripes/components';

import { usePreviewRecords } from '../../../../API';
import { usePathParams } from '../../../../hooks';


const contentData = [
  { 'username': 'innreachClient',
    'id': '7249ba08-41b5-55e2-8109-a20a440e0527',
    'active': true,
    'barcode': '321456',
    'patronGroup': '3684a786-6671-4268-8ed0-9db82ebca60b',
    'departments': [],
    'proxyFor': [],
    'personal': { 'lastName': 'SYSTEM', 'firstName': 'innreachClient', 'addresses': [] },
    'createdDate': '2021-12-16T03:35:55.003+00:00',
    'updatedDate': '2021-12-16T03:35:55.003+00:00',
    'metadata': { 'createdDate': '2021-12-16T03:35:55.000+00:00', 'createdByUserId': 'ec2643eb-c7bc-5f8d-addf-768c5dd08266', 'updatedDate': '2021-12-16T03:35:55.000+00:00', 'updatedByUserId': 'ec2643eb-c7bc-5f8d-addf-768c5dd08266' } },
];

const columnWidths = {
  status: '10%',
  lastName: '15%',
  firstName: '15%',
  barcode: '15%',
  patronGroup: '15%',
  username: '30%',
};

export const PreviewList = () => {
  const { id } = usePathParams('/bulk-edit/:id');
  const { data } = usePreviewRecords(id);

  console.log(`data`, data);

  return (
    <MultiColumnList
      striped
      contentData={contentData}
      // columnWidths={columnWidths}
      columnMapping={{
        status: <FormattedMessage id="ui-bulk-edit.list.preview.table.status" />,
        lastName: <FormattedMessage id="ui-bulk-edit.list.preview.table.lastName" />,
        firstName: <FormattedMessage id="ui-bulk-edit.list.preview.table.firstName" />,
        barcode: <FormattedMessage id="ui-bulk-edit.list.preview.table.barcode" />,
        patronGroup: <FormattedMessage id="ui-bulk-edit.list.preview.table.patronGroup" />,
        username: <FormattedMessage id="ui-bulk-edit.list.preview.table.username" />,
      }}
      visibleColumns={[
        'status', 'lastName', 'firstName', 'barcode', 'patronGroup', 'username',
      ]}
    />
  );
};
