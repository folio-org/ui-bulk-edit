import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import noop from 'lodash/noop';

import { Col, MultiColumnList, Row } from '@folio/stripes/components';
import {
  RESULT_COUNT_INCREMENT,
  NoResultsMessage,
  PrevNextPagination,
  useLocationFilters,
  useLocationSorting,
  usePagination,
} from '@folio/stripes-acq-components';

import { LOGS_COLUMNS } from '../../constants';
import { getLogsResultsFormatter } from '../../utils/formatters';
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
  id: '14%',
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

  const [
    filters,
  ] = useLocationFilters(location, history);
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
  } = useBulkEditLogs({ search: location.search, pagination });

  const resultsStatusMessage = (
    <NoResultsMessage
      isLoading={isLoading}
      filters={filters}
      isFiltersOpened
      toggleFilters={noop}
    />
  );

  return (
    <Row>
      <Col xs={12}>
        <MultiColumnList
          contentData={logs}
          totalCount={logsCount}
          columnMapping={columnMapping}
          visibleColumns={visibleColumns}
          formatter={getLogsResultsFormatter(userNamesMap)}
          columnWidths={columnWidths}
          isEmptyMessage={resultsStatusMessage}
          pagingType="none"
          sortOrder={sortingField}
          sortDirection={sortingDirection}
          onHeaderClick={changeSorting}
          onNeedMoreData={changePage}
        />

        {logs.length > 0 && (
          <PrevNextPagination
            {...pagination}
            totalCount={logsCount}
            disabled={isLoading}
            onChange={changePage}
          />
        )}
      </Col>
    </Row>
  );
};

export default BulkEditLogs;
