import { useEffect } from 'react';
import { buildSearch } from '@folio/stripes-acq-components';
import { useHistory } from 'react-router-dom';
import { useQueryClient } from 'react-query';

export const useResetAppState = ({
  setFilters,
  setConfirmedFileName,
  initialFiltersState,
  setVisibleColumns,
  setCountOfRecords,
  setNewBulkFooterShown,
  filtersTab,
  setIsBulkEditLayerOpen,
}) => {
  const history = useHistory();
  const queryClient = useQueryClient();

  useEffect(() => {
    const initialRoute = '/bulk-edit';

    if (history.location.pathname === initialRoute && !history.location.search) {
      // reset count of records
      setCountOfRecords(0);

      // reset filters
      setFilters(initialFiltersState);

      // clear bulkOperation information
      queryClient.setQueryData('bulkOperationDetails', () => ({ data: undefined }));

      // reset confirmed file name
      setConfirmedFileName(null);

      // clear visibleColumns preset
      setVisibleColumns(null);

      const [status, entityType, operationType, startTime, endTime] = filtersTab.logsTab;

      // set user capability by default
      history.replace({
        search: buildSearch({
          criteria: initialFiltersState.criteria,
          identifier: initialFiltersState.identifier,
          capabilities: initialFiltersState.capabilities,
          status,
          entityType,
          operationType,
          startTime,
          endTime,
        }),
      });

      setNewBulkFooterShown(false);

      setIsBulkEditLayerOpen(false);
    }
  }, [history.location]);
};
