import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import noop from 'lodash/noop';

import { AppIcon } from '@folio/stripes/core';
import { MultiColumnList } from '@folio/stripes/components';
import {
  ResultsPane,
  NoResultsMessage,
  PrevNextPagination,
  useLocationSorting,
  usePagination,
} from '@folio/stripes-acq-components';

import { LOGS_COLUMNS, LOGS_PAGINATION_CONFIG } from '../../constants';
import { getLogsResultsFormatter } from '../../utils/formatters';
import { useLogsQueryParams } from '../../hooks';
import { useBulkEditLogs } from '../../hooks/api';

const resetData = () => {};

const visibleColumns = LOGS_COLUMNS.map(i => i.value);
const columnMapping = LOGS_COLUMNS.reduce((acc, el) => {
  acc[el.value] = el.label;

  return acc;
}, {});
const sortableFields = LOGS_COLUMNS
  .filter(({ sortable }) => sortable)
  .map(({ value }) => value);

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
  } = usePagination(LOGS_PAGINATION_CONFIG);

  const {
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
      notLoadedMessage={<FormattedMessage id="ui-bulk-edit.list.result.emptyMessage.logs" />}
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
      appIcon={<AppIcon app="bulk-edit" iconKey="app" />}
    >
      {({ height, width }) => (
        <>
          <MultiColumnList
            loading={isLoading}
            contentData={logs}
            totalCount={logsCount}
            columnMapping={columnMapping}
            visibleColumns={visibleColumns}
            formatter={getLogsResultsFormatter()}
            isEmptyMessage={resultsStatusMessage}
            sortOrder={sortingField}
            sortDirection={sortingDirection}
            onHeaderClick={changeSorting}
            onNeedMoreData={changePage}
            pagingType="none"
            hasMargin
            height={height - PrevNextPagination.HEIGHT}
            width={width}
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
