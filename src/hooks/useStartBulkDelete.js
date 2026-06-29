import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useQueryClient } from 'react-query';

import { buildSearch } from '@folio/stripes-acq-components';

import { useSearchParams } from './useSearchParams';
import { useErrorMessages } from './useErrorMessages';
import { BULK_OPERATION_DETAILS_KEY, useBulkOperationStart } from './api';
import { EDITING_STEPS } from '../constants';

export const useStartBulkDelete = ({
  bulkOperationId,
  onDeleteStarted,
}) => {
  const history = useHistory();
  const queryClient = useQueryClient();
  const { criteria } = useSearchParams();
  const { showErrorMessage } = useErrorMessages();
  const { bulkOperationStart } = useBulkOperationStart();

  const [isDeleting, setIsDeleting] = useState(false);

  const startBulkDelete = async () => {
    setIsDeleting(true);

    try {
      const result = await bulkOperationStart({
        id: bulkOperationId,
        step: EDITING_STEPS.DELETE,
      });

      queryClient.setQueriesData(BULK_OPERATION_DETAILS_KEY, {
        ...result,
        processedNumOfRecords: 0 // it's required to show correct progress on next step
      });

      onDeleteStarted?.();

      history.replace({
        pathname: `/bulk-edit/${bulkOperationId}/preview`,
        search: buildSearch({
          step: EDITING_STEPS.COMMIT,
          progress: criteria,
        }, history.location.search),
      });
    } catch (e) {
      showErrorMessage(e);
    } finally {
      setIsDeleting(false);
    }
  };

  return { startBulkDelete, isDeleting };
};

