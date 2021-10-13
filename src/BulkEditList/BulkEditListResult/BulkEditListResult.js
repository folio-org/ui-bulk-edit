import { FormattedMessage } from 'react-intl';
import {
  MultiColumnList,
  Layout,
} from '@folio/stripes/components';

import { NoResultsMessage } from './NoResultsMessage/NoResultsMessage';

export const BulkEditListResult = () => {
  const resultsStatusMessage = (
    <Layout className="display-flex centerContent">
      <NoResultsMessage>
        <FormattedMessage id="ui-bulk-edit.list.result.emptyMessage" />
      </NoResultsMessage>
    </Layout>
  );

  return (
    <MultiColumnList
      autosize
      isEmptyMessage={resultsStatusMessage}
    />
  );
};
