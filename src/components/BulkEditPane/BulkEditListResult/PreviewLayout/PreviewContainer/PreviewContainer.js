import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Headline,
  AccordionStatus,
  MessageBanner,
} from '@folio/stripes/components';

import { CRITERIA, EDITING_STEPS, OPERATION_TYPES, RECORD_TYPES_MAPPING } from '../../../../../constants';
import { NoResultsMessage } from '../../NoResultsMessage/NoResultsMessage';
import { useSearchParams } from '../../../../../hooks';
import { PreviewErrorsAccordionContainer } from '../PreviewErrorsAccordion/PreviewErrorsAccordionContainer';
import { PreviewRecordsAccordionContainer } from '../PreviewRecordsAccordion/PreviewRecordsAccordionContainer';
import { getBulkOperationStatsByStep } from '../helpers';

import css from '../Preview.css';


export const PreviewContainer = ({ title, bulkDetails }) => {
  const { criteria, step, progress, currentRecordType } = useSearchParams();
  const isInitial = step === EDITING_STEPS.UPLOAD;
  const isDelete = bulkDetails.operationType === OPERATION_TYPES.DELETE;

  const isOtherTabProcessing = progress && criteria !== progress;
  const shouldShowPreview = !isOtherTabProcessing && Boolean(bulkDetails);

  const { countOfRecords } = getBulkOperationStatsByStep(bulkDetails, step);

  if (!((bulkDetails.fqlQuery && criteria === CRITERIA.QUERY) || (criteria !== CRITERIA.QUERY && !bulkDetails.fqlQuery))) {
    return <NoResultsMessage />;
  }

  return (
    <AccordionStatus>
      <div className={css.previewContainer}>
        {!isInitial && (
        <Headline size="large" margin="small">
          <MessageBanner type="success" contentClassName="SuccessBanner">
            {isDelete ? (
              <FormattedMessage
                id="ui-bulk-edit.recordsSuccessfullyDeleted"
                values={{ value: countOfRecords, recordType: RECORD_TYPES_MAPPING[currentRecordType] }}
              />
            ) : (
              <FormattedMessage
                id="ui-bulk-edit.recordsSuccessfullyChanged"
                values={{ value: countOfRecords }}
              />
            )}
          </MessageBanner>
        </Headline>
        )}
        <div className={css.titleContainer}>
          {title && (
            <Headline size="large" margin="medium">
              {title}
            </Headline>
          )}
        </div>
        <div className={css.previewAccordionOuter}>
          {shouldShowPreview && (
            <>
              <PreviewRecordsAccordionContainer bulkDetails={bulkDetails} />
              <PreviewErrorsAccordionContainer bulkDetails={bulkDetails} />
            </>
          )}
        </div>
      </div>
    </AccordionStatus>
  );
};

PreviewContainer.propTypes = {
  title: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  bulkDetails: PropTypes.shape({
    totalNumOfRecords: PropTypes.number,
    matchedNumOfRecords: PropTypes.number,
    committedNumOfRecords: PropTypes.number,
    processedNumOfRecords: PropTypes.number,
    matchedNumOfWarnings: PropTypes.number,
    committedNumOfWarnings: PropTypes.number,
    matchedNumOfErrors: PropTypes.number,
    committedNumOfErrors: PropTypes.number,
    fqlQuery: PropTypes.string,
    status: PropTypes.string,
  }),
};
