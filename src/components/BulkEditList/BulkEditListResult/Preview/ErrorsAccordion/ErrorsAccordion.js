import { PropTypes } from 'prop-types';
import { useLocation } from 'react-router-dom';
import { FormattedMessage } from 'react-intl';
import {
  Accordion,
  MultiColumnList,
  Headline,
} from '@folio/stripes/components';
import { useState } from 'react';
import css from '../Preview.css';
import { useSearchParams } from '../../../../../hooks/useSearchParams';
import { CRITERIA } from '../../../../../constants';

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
  const { criteria } = useSearchParams();
  const fileName = new URLSearchParams(location.search).get('fileName');
  const errorLength = errors.length;

  const [opened, setOpened] = useState(!!errorLength);

  const headLineTranslateKey = isInitial ? 'info' : 'infoProcessed';

  const headLine = criteria === CRITERIA.QUERY ?
    (
      <FormattedMessage
        id={`ui-bulk-edit.list.errors.query.${headLineTranslateKey}`}
        values={{
          entries,
          matched,
          errors: countOfErrors,
        }}
      />
    )
    :
    (
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
    <div className={css.previewAccordion}>
      <Accordion
        open={opened}
        onToggle={() => {
          setOpened(!opened);
        }}
        label={<FormattedMessage id="ui-bulk-edit.list.errors.title" />}
      >
        <div className={css.errorAccordionOuter}>
          <Headline size="medium" margin="small">
            {headLine}
          </Headline>
          <div className={css.errorAccordionList}>
            <MultiColumnList
              contentData={errors}
              columnMapping={columnMapping}
              formatter={resultsFormatter}
              visibleColumns={visibleColumns}
              autosize
            />
          </div>
        </div>
      </Accordion>
    </div>
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
