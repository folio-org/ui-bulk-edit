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

const visibleColumns = ['identifier', 'message'];

const resultsFormatter = {
  identifier: error => error.identifier,
  message: error => error.message,
};

const columnMapping = {
  identifier: <FormattedMessage id="ui-bulk-edit.list.errors.table.code" />,
  message: <FormattedMessage id="ui-bulk-edit.list.errors.table.message" />,
};

const ErrorsAccordion = (
  { errors = [],
    entries,
    countOfErrors,
    matched },
) => {
  const location = useLocation();
  const fileName = new URLSearchParams(location.search).get('fileName');
  const errorLength = errors.length;

  return (
    <>
      <Accordion
        open={!!errorLength}
        label={<FormattedMessage id="ui-bulk-edit.list.errors.title" />}
      >

        {!!errorLength && (
          <Row>
            <Col xs={12}>
              <Headline size="medium" margin="small">
                {location.pathname === '/bulk-edit/:id/initial' ?
                  <FormattedMessage
                    id="ui-bulk-edit.list.errors.info"
                    values={{
                      fileName,
                      entries,
                      matched,
                      errors: countOfErrors,
                    }}
                  /> :
                  <FormattedMessage
                    id="ui-bulk-edit.list.errors.infoProccessed"
                    values={{
                      fileName,
                      entries,
                      matched,
                      errors: countOfErrors,
                    }}
                  />}
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
  countOfErrors: PropTypes.number,
  matched: PropTypes.number,
};

export default ErrorsAccordion;
