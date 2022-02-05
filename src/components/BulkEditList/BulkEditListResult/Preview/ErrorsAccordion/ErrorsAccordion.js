import { PropTypes } from 'prop-types';
import { useLocation } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  Col,
  Row,
  MultiColumnList,
  Headline,
} from '@folio/stripes/components';

const visibleColumns = ['message', 'code'];

const resultsFormatter = {
  message: error => error.message,
  code: error => error.code,
};

const columnMapping = {
  code: <FormattedMessage id="ui-bulk-edit.list.errors.table.code" />,
  message: <FormattedMessage id="ui-bulk-edit.list.errors.table.message" />,
};

const ErrorsAccordion = ({ errors = [], entries, matched }) => {
  const location = useLocation();

  const fileName = new URLSearchParams(location.search).get('fileName');

  return (
    <>
      <Accordion
        open={errors.length}
        label={<FormattedMessage id="ui-bulk-edit.list.errors.title" />}
      >

        {!!errors.length && (
          <Row>
            <Col xs={12}>
              <Headline size="medium" margin="small">
                <FormattedMessage
                  id="ui-bulk-edit.list.errors.info"
                  values={{
                    fileName,
                    entries,
                    matched,
                    errors: errors.length,
                  }}
                />
              </Headline>
            </Col>
          </Row>
        )}
        <Row>
          <Col xs={12}>
            <MultiColumnList
              contentData={errors}
              columnMapping={columnMapping}
              formatter={resultsFormatter}
              visibleColumns={visibleColumns}
            />
          </Col>
        </Row>
      </Accordion>
    </>
  );
};

ErrorsAccordion.propTypes = {
  errors: PropTypes.arrayOf(PropTypes.object),
  entries: PropTypes.number,
  matched: PropTypes.number,
};

export default ErrorsAccordion;
