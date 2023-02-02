import { FormattedMessage } from 'react-intl';
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
import {
  useErrorsPreview,
} from '../../../../hooks/api';
import { RootContext } from '../../../../context/RootContext';
import { useRecordsPreview } from '../../../../hooks/api/useRecordsPreview';
import { EDITING_STEPS } from '../../../../constants';

export const Preview = ({ id, title, isInitial, bulkDetails }) => {
  const location = useLocation();
  const { setNewBulkFooterShown, countOfRecords, setCountOfRecords, visibleColumns } = useContext(RootContext);
  const [countOfErrors, setCountOfErrors] = useState(0);

  const search = new URLSearchParams(location.search);
  const step = search.get('step');

  const { contentData, columns, columnsMapping } = useRecordsPreview({ id, step });
  const { data } = useErrorsPreview({ id });
  const errors = data?.errors || [];

  useEffect(() => {
    const isInitialPreview = step === EDITING_STEPS.UPLOAD;

    const countRecords = isInitialPreview
      ? bulkDetails.matchedNumOfRecords
      : bulkDetails.committedNumOfRecords;

    const countErrors = isInitialPreview
      ? bulkDetails.matchedNumOfErrors
      : bulkDetails.commitedNumOfErrors;

    setCountOfErrors(countErrors);
    setCountOfRecords(countRecords);
  }, [bulkDetails, step]);

  useEffect(() => {
    if (contentData || errors?.length) {
      setNewBulkFooterShown(true);
    }
  }, [contentData, errors]);


  return (
    <AccordionStatus>
      {!isInitial && (
      <Headline size="large" margin="small">
        <MessageBanner type="success" contentClassName="SuccessBanner">
          <FormattedMessage
            id="ui-bulk-edit.recordsSuccessfullyChanged"
            values={{ value: countOfRecords }}
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
        {!!contentData?.length && (
        <PreviewAccordion
          isInitial={isInitial}
          columns={columns}
          contentData={contentData}
          columnsMapping={columnsMapping}
          visibleColumns={visibleColumns}
        />
        )}
        {!!errors?.length && (
          <ErrorsAccordion
            errors={errors}
            entries={bulkDetails.totalNumOfRecords}
            matched={countOfRecords}
            countOfErrors={countOfErrors}
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
    commitedNumOfErrors: PropTypes.number,
  }),
};
