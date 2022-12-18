import React from 'react';
import { Col, Row, Accordion, MultiColumnList } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { CAPABILITIES_VALUE } from '../../constants';
import { useRetrievedDataList } from '../../API/useReatrievedDataList';
import { getMappedTableData } from '../../../test/jest/utils/mappers';

const RetrievedDataList = (props) => {
  const location = useLocation();
  const capability = new URLSearchParams(location.search).get('capabilities');
  const data = useRetrievedDataList({ capability });

  const { contentData, formatter, columns, visibleColumns } = getMappedTableData(data);

  return (
    <>
      <Accordion
        label={
          <FormattedMessage
            id="ui-bulk-edit.retrievedDataList.title"
            values={{
              matched: contentData?.length,
              capability: CAPABILITIES_VALUE[capability],
            }}
          />
      }
      >
        <Row>
          <Col xs={12}>
            <MultiColumnList
              contentData={contentData}
              formatter={formatter}
              columnMapping={columns}
              visibleColumns={visibleColumns}
              {...props}
            />
          </Col>
        </Row>
      </Accordion>
    </>
  );
};

RetrievedDataList.propTypes = {
  capability: PropTypes.string,
  ...MultiColumnList.propTypes,
};

export default RetrievedDataList;
