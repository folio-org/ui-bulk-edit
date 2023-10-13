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

const visibleColumns = ['key', 'message'];

const resultsFormatter = {
  key: error => error.parameters[0].value,
  message: error => error.message,
};

const columnMapping = {
  key: <FormattedMessage id="ui-bulk-edit.list.errors.table.code" />,
  message: <FormattedMessage id="ui-bulk-edit.list.errors.table.message" />,
};

const ErrorsAccordion = ({
  errors = [],
  entries,
  countOfErrors,
  matched,
  isInitial,
}) => {
  const location = useLocation();
  const fileName = new URLSearchParams(location.search).get('fileName');
  const errorLength = errors.length;
  const maxHeight = window.innerHeight * 0.4;

  const headLineTranslateKey = isInitial ? 'info' : 'infoProcessed';
  const headLine = (
    <FormattedMessage
      id={`ui-bulk-edit.list.errors.${headLineTranslateKey}`}
      values={{
        fileName,
        entries,
        matched,
        errors: countOfErrors,
      }}
    />
  );

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
                {headLine}
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
              maxHeight={maxHeight}
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
  isInitial: PropTypes.bool,
};

export default ErrorsAccordion;
