import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import noop from 'lodash/noop';

import { MultiColumnList } from '@folio/stripes/components';
import {
  RESULT_COUNT_INCREMENT,
  ResultsPane,
  NoResultsMessage,
  PrevNextPagination,
  useLocationSorting,
  usePagination,
} from '@folio/stripes-acq-components';

import { LOGS_COLUMNS } from '../../constants';
import { getLogsResultsFormatter } from '../../utils/formatters';
import { useLogsQueryParams } from '../../hooks';
import { useBulkEditLogs } from '../../hooks/api/useBulkEditLogs';

const resetData = () => {};

const visibleColumns = LOGS_COLUMNS.map(i => i.value);
const columnMapping = LOGS_COLUMNS.reduce((acc, el) => {
  acc[el.value] = el.label;

  return acc;
}, {});
const sortableFields = LOGS_COLUMNS
  .filter(({ sortable }) => sortable)
  .map(({ value }) => value);
const columnWidths = {
  id: '15%',
  operationType: '12%',
  entityType: '8%',
  status: '8%',
  userId: '12%',
  startTime: '10%',
  endTime: '10%',
  totalNumOfRecords: '7%',
  processedNumOfRecords: '7%',
  editing: '7%',
  actions: '3%',
};

const BulkEditLogs = () => {
  const location = useLocation();
  const history = useHistory();

  const { logsQueryParams } = useLogsQueryParams({ search: location.search });

  const [
    sortingField,
    sortingDirection,
    changeSorting,
  ] = useLocationSorting(location, history, resetData, sortableFields);

  const {
    pagination,
    changePage,
  } = usePagination({ limit: RESULT_COUNT_INCREMENT, offset: 0 });

  const {
    userNamesMap,
    logs,
    logsCount,
    isLoading,
  } = useBulkEditLogs({ filters: logsQueryParams, pagination });

  const resultsStatusMessage = (
    <NoResultsMessage
      isLoading={isLoading}
      filters={logsQueryParams}
      isFiltersOpened
      toggleFilters={noop}
    />
  );

  return (
    <ResultsPane
      id="bulk-edit-logs-pane"
      autosize
      title={<FormattedMessage id="ui-bulk-edit.meta.logs.title" />}
      count={logsCount}
      toggleFiltersPane={noop}
      filters={logsQueryParams}
      isFiltersOpened
      isLoading={isLoading}
    >
      {({ height, width }) => (
        <>
          <MultiColumnList
            loading={isLoading}
            contentData={logs}
            totalCount={logsCount}
            columnMapping={columnMapping}
            visibleColumns={visibleColumns}
            formatter={getLogsResultsFormatter(userNamesMap)}
            isEmptyMessage={resultsStatusMessage}
            sortOrder={sortingField}
            sortDirection={sortingDirection}
            onHeaderClick={changeSorting}
            onNeedMoreData={changePage}
            pagingType="none"
            hasMargin
            height={height - PrevNextPagination.HEIGHT}
            width={width}
            columnWidths={columnWidths}
          />
          {logs.length > 0 && (
            <PrevNextPagination
              {...pagination}
              totalCount={logsCount}
              disabled={isLoading}
              onChange={changePage}
            />
          )}
        </>
      )}
    </ResultsPane>
  );
};

export default BulkEditLogs;
