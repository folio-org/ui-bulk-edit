import { FormattedMessage, useIntl } from 'react-intl';
import {
  Headline,
  AccordionSet,
  AccordionStatus,
  MessageBanner,
} from '@folio/stripes/components';
import PropTypes from 'prop-types';
import { useContext, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { PreviewAccordion } from './PreviewAccordion';
import { ErrorsAccordion } from './ErrorsAccordion';
import { useErrorsPreview,
  useRecordsPreview } from '../../../../hooks/api';
import { RootContext } from '../../../../context/RootContext';

import { EDITING_STEPS } from '../../../../constants';

export const Preview = ({ id, title, isInitial, bulkDetails }) => {
  const location = useLocation();
  const intl = useIntl();
  const { countOfRecords, setCountOfRecords, visibleColumns } = useContext(RootContext);
  const [countOfErrors, setCountOfErrors] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  const search = new URLSearchParams(location.search);
  const step = search.get('step');
  const capabilities = search.get('capabilities');

  const { contentData, columns, columnMapping } = useRecordsPreview({ id, step, capabilities });
  const { data } = useErrorsPreview({ id });
  const errors = data?.errors || [];

  useEffect(() => {
    const isInitialPreview = step === EDITING_STEPS.UPLOAD;

    const countRecords = isInitialPreview
      ? bulkDetails.matchedNumOfRecords
      : bulkDetails.committedNumOfRecords;

    const countErrors = isInitialPreview
      ? bulkDetails.matchedNumOfErrors
      : bulkDetails.committedNumOfErrors;

    setCountOfErrors(countErrors);
    setCountOfRecords(countRecords);
    setTotalCount(isInitialPreview ? bulkDetails.totalNumOfRecords : bulkDetails.matchedNumOfRecords);
  }, [bulkDetails, step]);


  return (
    <AccordionStatus>
      {!isInitial && (
        <Headline size="large" margin="small">
          <MessageBanner type="success" contentClassName="SuccessBanner">
            <FormattedMessage
              id="ui-bulk-edit.recordsSuccessfullyChanged"
              values={{ value: intl.formatNumber(countOfRecords) }}
            />
          </MessageBanner>
        </Headline>
      )}
      {title && (
        <Headline size="large" margin="medium">
          {title}
        </Headline>
      )}
      <AccordionSet>
        {Boolean(contentData?.length) && (
          <PreviewAccordion
            isInitial={isInitial}
            columns={columns}
            contentData={contentData}
            columnMapping={columnMapping}
            visibleColumns={visibleColumns}
          />
        )}
        {Boolean(errors?.length) && (
          <ErrorsAccordion
            errors={errors}
            entries={totalCount}
            matched={countOfRecords}
            countOfErrors={countOfErrors}
            isInitial={isInitial}
            intl={intl}
          />
        )}
      </AccordionSet>
    </AccordionStatus>
  );
};

Preview.propTypes = {
  id: PropTypes.string,
  title: PropTypes.string,
  isInitial: PropTypes.bool,
  bulkDetails: PropTypes.shape({
    totalNumOfRecords: PropTypes.number,
    matchedNumOfRecords: PropTypes.number,
    committedNumOfRecords: PropTypes.number,
    processedNumOfRecords: PropTypes.number,
    matchedNumOfErrors: PropTypes.number,
    committedNumOfErrors: PropTypes.number,
  }),
};
