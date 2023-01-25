import React from 'react';
import { Col, MultiColumnList, Row } from '@folio/stripes/components';
import { useLocation } from 'react-router-dom';
import { LOGS_COLUMNS } from '../../constants';
import { getLogsResultsFormatter } from '../../constants/formatters';
import { useBulkEditLogs } from '../../API/useBulkEditLogs';


const BulkEditLogs = () => {
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const { logs, userNamesMap } = useBulkEditLogs({ search, location });

  const columnMapping = LOGS_COLUMNS.reduce((acc, el) => {
    acc[el.value] = el.label;

    return acc;
  }, {});

  const visibleColumns = LOGS_COLUMNS.map(i => i.value);

  return (
    <Row>
      <Col xs={12}>
        <MultiColumnList
          striped
          contentData={logs}
          columnMapping={columnMapping}
          visibleColumns={visibleColumns}
          formatter={getLogsResultsFormatter(userNamesMap)}
          pagingType="prev-next"
        />
      </Col>
    </Row>
  );
};

export default BulkEditLogs;
