import React from 'react';
import { Col, Row, Accordion, MultiColumnList } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import { PrevNextPagination, usePagination } from '@folio/stripes-acq-components';
import { CAPABILITIES_VALUE, EDITING_STEPS } from '../../constants';
import { useRecordsPreview } from '../../hooks/api/useRecordsPreview';

const RetrievedDataList = (props) => {
  const location = useLocation();
  const capability = new URLSearchParams(location.search).get('capabilities');
  const { contentData, columnsMapping, columns } = useRecordsPreview({ capability, step: EDITING_STEPS.EDIT });
  const { changePage, pagination } = usePagination({ limit: 100, offset: 0 });

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
              columnMapping={columnsMapping}
              visibleColumns={[]}
              onNeedMoreData={changePage}
              pagingType={null}
              {...props}
            />
            {contentData.length > 0 && (
              <PrevNextPagination
                {...pagination}
                totalCount={contentData.length}
                disabled={!contentData}
                onChange={changePage}
              />
            )}
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
