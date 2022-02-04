import { useMemo } from 'react';
import { PropTypes } from 'prop-types';
import { useLocation } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  Col,
  Row,
  MultiColumnList,
} from '@folio/stripes/components';

const resultsFormatter = {
  message: error => error.message,
  firstName: user => user.personal?.firstName,
  barcode: user => user.barcode,
  patronGroup: user => user.patronGroup,
  username: user => user.username,
  email: user => user.personal.email,
};
const columnMapping = {
  code: <FormattedMessage id="ui-bulk-edit.list.errors.table.code" />,
  message: <FormattedMessage id="ui-bulk-edit.list.errors.table.message" />,
};

const ErrorsAccordion = ({ errors }) => {
  const location = useLocation();

  const fileName = new URLSearchParams(location.search).get('fileName');

  const recordsInfo = useMemo(() => (
    <FormattedMessage
      id="ui-bulk-edit.list.errors.info"
      values={{
        fileName,
        entries: 302,
        matched: 300,
      }}
    />
  ), []);

  return (
    <Accordion
      // closedByDefault
      // open={!!users.length}
      label={<FormattedMessage id="ui-bulk-edit.list.errors.title" />}
    >
      <Row>
        <Col xs={12}>{recordsInfo}</Col>
      </Row>
      <Row>
        <Col xs={12}>
          <MultiColumnList
            contentData={errors}
            columnMapping={columnMapping}
            formatter={resultsFormatter}
            // visibleColumns={visibleColumns}
          />
        </Col>
      </Row>
    </Accordion>
  );
};

ErrorsAccordion.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.object),
};

export default ErrorsAccordion;
