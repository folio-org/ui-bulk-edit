import React from 'react';
import { FormattedMessage } from 'react-intl';
import PropTypes from 'prop-types';

import {
  Headline,
  AccordionStatus,
  MessageBanner,
} from '@folio/stripes/components';

import css from './Preview.css';
import { PreviewAccordion } from './PreviewAccordion';
import { ErrorsAccordion } from './ErrorsAccordion';
import {
  RECORDS_PREVIEW_KEY,
  useErrorsPreview,
  useRecordsPreview
} from '../../../../hooks/api';
import {
  CRITERIA,
  PAGINATION_CONFIG,
  ERRORS_PAGINATION_CONFIG,
  JOB_STATUSES
} from '../../../../constants';
import { usePagination } from '../../../../hooks/usePagination';
import { useBulkOperationStats } from '../../../../hooks/useBulkOperationStats';
import { NoResultsMessage } from '../NoResultsMessage/NoResultsMessage';
import { useSearchParams } from '../../../../hooks';
import { useErrorType } from '../../../../hooks/useErrorType';

export const Preview = ({ id, title, isInitial, bulkDetails }) => {
  const {
    criteria,
    queryRecordType,
    step,
    currentRecordType,
    progress,
  } = useSearchParams();

  const {
    countOfRecords,
    countOfErrors,
    countOfWarnings,
    visibleColumns,
  } = useBulkOperationStats({ bulkDetails, step });

  const { errorType, hasErrorsOrWarnings, toggleShowWarnings } = useErrorType({
    countOfErrors,
    countOfWarnings
  });

  const isOtherTabProcessing = progress && criteria !== progress;
  const statusesForPreview = [JOB_STATUSES.REVIEW_CHANGES, JOB_STATUSES.REVIEWED_NO_MARC_RECORDS, JOB_STATUSES.DATA_MODIFICATION, JOB_STATUSES.COMPLETED, JOB_STATUSES.COMPLETED_WITH_ERRORS];
  const isPreviewEnabled = !isOtherTabProcessing && Boolean(id) && statusesForPreview.includes(bulkDetails?.status);
  const hasErrorType = errorType !== null;
  const isErrorsPreviewEnabled = isPreviewEnabled && hasErrorType && hasErrorsOrWarnings;

  const {
    pagination: previewPagination,
    changePage: changePreviewPage,
  } = usePagination(PAGINATION_CONFIG);

  const { contentData, columns, columnMapping, isFetching: isPreviewFetching } = useRecordsPreview({
    key: RECORDS_PREVIEW_KEY,
    capabilities: currentRecordType,
    id,
    step,
    criteria,
    queryRecordType,
    queryOptions: {
      enabled: isPreviewEnabled,
    },
    ...previewPagination,
  });

  const {
    pagination: errorsPagination,
    changePage: changeErrorPage,
  } = usePagination(ERRORS_PAGINATION_CONFIG);

  const { errors, isFetching: isErrorsFetching } = useErrorsPreview({
    id,
    step,
    errorType,
    enabled: isErrorsPreviewEnabled,
    ...errorsPagination,
  });

  const handleToggleWarnings = () => {
    changeErrorPage(ERRORS_PAGINATION_CONFIG);
    toggleShowWarnings();
  };

  if (!((bulkDetails.fqlQuery && criteria === CRITERIA.QUERY) || (criteria !== CRITERIA.QUERY && !bulkDetails.fqlQuery))) {
    return <NoResultsMessage />;
  }

  return (
    <AccordionStatus>
      <div className={css.previewContainer}>
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
        <div className={css.previewAccordionOuter}>
          {Boolean(contentData?.length) && (
            <PreviewAccordion
              totalRecords={countOfRecords}
              isInitial={isInitial}
              columns={columns}
              contentData={contentData}
              columnMapping={columnMapping}
              visibleColumns={visibleColumns}
              step={step}
              onChangePage={changePreviewPage}
              pagination={previewPagination}
              isFetching={isPreviewFetching}
            />
          )}

          {Boolean(errors?.length) && (
            <ErrorsAccordion
              errors={errors}
              totalErrors={countOfErrors}
              totalWarnings={countOfWarnings}
              errorType={errorType}
              onChangePage={changeErrorPage}
              onShowWarnings={handleToggleWarnings}
              pagination={errorsPagination}
              isFetching={isErrorsFetching}
            />
          )}
        </div>
      </div>
    </AccordionStatus>
  );
};

Preview.propTypes = {
  id: PropTypes.string,
  title: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  isInitial: PropTypes.bool,
  bulkDetails: PropTypes.shape({
    totalNumOfRecords: PropTypes.number,
    matchedNumOfRecords: PropTypes.number,
    committedNumOfRecords: PropTypes.number,
    processedNumOfRecords: PropTypes.number,
    matchedNumOfErrors: PropTypes.number,
    committedNumOfErrors: PropTypes.number,
    fqlQuery: PropTypes.string,
    status: PropTypes.string,
  }),
};
