import React from 'react';
import { Col, Row, Accordion, MultiColumnList } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { CAPABILITIES_VALUE } from '../../constants';
import { useRetrievedDataList } from '../../API/useReatrievedDataList';

const RetrievedDataList = (props) => {
  const location = useLocation();
  const capability = new URLSearchParams(location.search).get('capabilities');
  const data = useRetrievedDataList({ capability });

  const columns = data.header.map((cell) => ({
    label: cell.value,
    value: cell.value,
    disabled: false,
    selected: true,
    visible: cell.visible,
  }));

  const formatter = columns.reduce((acc, { value }) => {
    acc[value] = item => item[value];

    return acc;
  }, {});

  const visibleColumns = columns.filter(col => col.visible).map(col => col.value);

  const contentData = data.rows.map(({ row }) => {
    return row.reduce((acc, item, index) => {
      acc[data.header[index].value] = item;

      return acc;
    }, {});
  });

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
