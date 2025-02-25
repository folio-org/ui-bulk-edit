import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useQueryClient } from 'react-query';

import { buildSearch } from '@folio/stripes-acq-components';

import { useSearchParams } from './useSearchParams';
import { useErrorMessages } from './useErrorMessages';
import { BULK_OPERATION_DETAILS_KEY, useBulkOperationStart } from './api';
import { APPROACHES, EDITING_STEPS } from '../constants';


export const useCommitChanges = ({
  bulkOperationId,
  onChangesCommited,
}) => {
  const history = useHistory();
  const queryClient = useQueryClient();
  const { criteria } = useSearchParams();
  const { showErrorMessage } = useErrorMessages();
  const { bulkOperationStart } = useBulkOperationStart();

  const [isCommitting, setIsCommitting] = useState(false);

  const commitChanges = async () => {
    setIsCommitting(true);

    try {
      const result = await bulkOperationStart({
        id: bulkOperationId,
        approach: APPROACHES.IN_APP,
        step: EDITING_STEPS.COMMIT,
      });

      queryClient.setQueriesData(BULK_OPERATION_DETAILS_KEY, {
        ...result,
        processedNumOfRecords: 0, // it's required to show correct progress on next step
      });

      onChangesCommited();

      history.replace({
        pathname: `/bulk-edit/${bulkOperationId}/preview`,
        search: buildSearch({
          progress: criteria,
        }, history.location.search),
      });
    } catch (e) {
      showErrorMessage(e);
    } finally {
      setIsCommitting(false);
    }
  };

  return { commitChanges, isCommitting };
};
