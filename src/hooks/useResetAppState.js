import { useEffect } from 'react';
import { buildSearch } from '@folio/stripes-acq-components';
import { useHistory } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { BULK_OPERATION_DETAILS_KEY } from './api';
import { CRITERIA } from '../constants';

export const useResetAppState = ({
  setConfirmedFileName,
  setVisibleColumns,
  setCountOfRecords,
  filtersTab,
  closeInAppLayer,
  closeMarcLayer,
}) => {
  const history = useHistory();
  const queryClient = useQueryClient();

  useEffect(() => {
    const initialRoute = '/bulk-edit';

    if (history.location.pathname === initialRoute && !history.location.search) {
      // reset count of records
      setCountOfRecords(0);

      // clear bulkOperation information
      queryClient.removeQueries({ queryKey: [BULK_OPERATION_DETAILS_KEY] });

      // reset confirmed file name
      setConfirmedFileName(null);

      // clear visibleColumns preset
      setVisibleColumns(null);

      const [status, entityType, operationType, startTime, endTime] = filtersTab.logsTab;

      // set user capability by default
      history.replace({
        search: buildSearch({
          criteria: CRITERIA.IDENTIFIER,
          identifier: '',
          capabilities: '',
          status,
          entityType,
          operationType,
          startTime,
          endTime,
        }),
      });

      closeInAppLayer();
      closeMarcLayer();
    }
  }, [
    history,
    setConfirmedFileName,
    setVisibleColumns,
    setCountOfRecords,
    filtersTab.logsTab,
    closeInAppLayer,
    closeMarcLayer,
    queryClient,
  ]);
};
