import { FormattedMessage } from 'react-intl';
import {
  Headline,
  AccordionSet,
  AccordionStatus,
  MessageBanner,
} from '@folio/stripes/components';
import PropTypes from 'prop-types';
import { useContext, useEffect } from 'react';
import { PreviewAccordion } from './PreviewAccordion';
import { ErrorsAccordion } from './ErrorsAccordion';
import {
  useErrorsPreview,
} from '../../../../hooks/api';
import { RootContext } from '../../../../context/RootContext';
import { useRecordsPreview } from '../../../../hooks/api/useRecordsPreview';

export const Preview = ({ id, title, isInitial, bulkDetails }) => {
  const { setNewBulkFooterShown, setCountOfRecords, visibleColumns } = useContext(RootContext);
  const { contentData, columns, formatter } = useRecordsPreview({ id });
  const { data } = useErrorsPreview({ id });
  const errors = data?.errors || [];

  useEffect(() => {
    setCountOfRecords(bulkDetails.totalNumOfRecords);
  }, [bulkDetails]);

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
            values={{ value: bulkDetails.processedNumOfRecords }}
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
        {!!contentData && (
        <PreviewAccordion
          isInitial={isInitial}
          columns={columns}
          contentData={contentData}
          formatter={formatter}
          visibleColumns={visibleColumns}
        />
        )}
        {!!errors?.length && (
          <ErrorsAccordion
            errors={errors}
            entries={bulkDetails.totalNumOfRecords}
            matched={bulkDetails.processedNumOfRecords}
            countOfErrors={errors.length || 0}
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
    processedNumOfRecords: PropTypes.number,
  }),
};
