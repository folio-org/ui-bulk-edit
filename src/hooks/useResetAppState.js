import { useEffect, useCallback } from 'react';
import { buildSearch } from '@folio/stripes-acq-components';
import { useHistory } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import queryString from 'query-string';
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

  const performReset = useCallback((criteria) => {
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
      pathname: '/bulk-edit',
      search: buildSearch({
        criteria,
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
  }, [
    setCountOfRecords,
    queryClient,
    setConfirmedFileName,
    setVisibleColumns,
    filtersTab.logsTab,
    history,
    closeInAppLayer,
    closeMarcLayer,
  ]);

  const resetAppState = useCallback(() => {
    const currentParams = queryString.parse(history.location.search);
    const currentCriteria = currentParams.criteria || CRITERIA.IDENTIFIER;

    performReset(currentCriteria);
  }, [performReset, history]);

  useEffect(() => {
    const initialRoute = '/bulk-edit';

    if (history.location.pathname === initialRoute && !history.location.search) {
      performReset(CRITERIA.IDENTIFIER);
    }
  }, [history, performReset]);

  return { resetAppState };
};
