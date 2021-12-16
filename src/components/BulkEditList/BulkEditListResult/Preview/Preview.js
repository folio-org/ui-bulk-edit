import { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Headline,
  Accordion,
  AccordionSet,
  Col,
  AccordionStatus,
  Row,
  MultiColumnList,
} from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import { PreviewList } from './PreviewList';

export const Preview = ({ fileUploadedName }) => {
  const [contentData] = useState([{
    identifier: 1,
    reason: 2,
  }]);

  const columnWidths = {
    identifier: '15%',
    reason: '85%',
  };

  return (
    <AccordionStatus>
      <Row>
        <Col xs={12}>
          <Headline size="large" margin="medium" tag="h3">
              FileName: {fileUploadedName}
          </Headline>
        </Col>
      </Row>
      <AccordionSet>
        <Accordion label={<FormattedMessage id="ui-bulk-edit.list.preview.title" />}>
          <Row>
            <Col xs={12}>
              <PreviewList />
            </Col>
          </Row>
        </Accordion>
        <Accordion label={<FormattedMessage id="ui-bulk-edit.list.errors.title" />}>
          <Row>
            <Col xs={12}>
              <Headline size="medium" margin="xx-small" tag="h4">
                  User-UUIDs.csv: 302 entries * 300 records matched
              </Headline>
            </Col>
          </Row>

          <Row>
            <Col xs={12}>
              <MultiColumnList
                striped
                contentData={contentData}
                columnWidths={columnWidths}
                columnMapping={{
                  identifier: <FormattedMessage id="ui-bulk-edit.list.errors.table.identifier" />,
                  reason: <FormattedMessage id="ui-bulk-edit.list.errors.table.reason" />,
                }}
                visibleColumns={[
                  'identifier', 'reason',
                ]}
              />
            </Col>
          </Row>

        </Accordion>
      </AccordionSet>
    </AccordionStatus>
  );
};

Preview.propTypes = {
  fileUploadedName: PropTypes.string,
};
