import React from 'react';
import { Col, MultiColumnList, Row } from '@folio/stripes/components';
import { useLocation } from 'react-router-dom';
import { LOGS_COLUMNS } from '../../constants';
import { getLogsResultsFormatter } from '../../utills/formatters';
import { useBulkEditLogs } from '../../hooks/api/useBulkEditLogs';

const BulkEditLogs = () => {
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const { logs } = useBulkEditLogs({ search });

  const columnMapping = LOGS_COLUMNS.reduce((acc, el) => {
    acc[el.value] = el.label;

    return acc;
  }, {});

  const visibleColumns = LOGS_COLUMNS.map(i => i.value);

  const columnWidths = {
    jobId: '3%',
    bulkOperationType: '12%',
    recordType: '8%',
    status: '12%',
    runBy: '12%',
    startedRunning: '12%',
    endedRunning: '12%',
    numberOfRecords: '7%',
    processed: '7%',
    editing: '7%',
    actions: '6%',
  };

  return (
    <Row>
      <Col xs={12}>
        <MultiColumnList
          striped
          contentData={logs}
          columnMapping={columnMapping}
          formatter={getLogsResultsFormatter()}
          visibleColumns={visibleColumns}
          pagingType="prev-next"
          columnWidths={columnWidths}
        />
      </Col>
    </Row>
  );
};

export default BulkEditLogs;
