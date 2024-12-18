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

  const commitChanges = async () => {
    try {
      await bulkOperationStart({
        id: bulkOperationId,
        approach: APPROACHES.IN_APP,
        step: EDITING_STEPS.COMMIT,
      });

      await queryClient.resetQueries(BULK_OPERATION_DETAILS_KEY);

      onChangesCommited();

      history.replace({
        pathname: `/bulk-edit/${bulkOperationId}/preview`,
        search: buildSearch({
          progress: criteria,
        }, history.location.search),
      });
    } catch (e) {
      showErrorMessage(e);
    }
  };

  return { commitChanges };
};
