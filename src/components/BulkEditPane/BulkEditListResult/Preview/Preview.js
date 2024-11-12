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
  EDITING_STEPS,
  PAGINATION_CONFIG
} from '../../../../constants';
import { usePagination } from '../../../../hooks/usePagination';
import { useBulkOperationStats } from '../../../../hooks/useBulkOperationStats';
import { NoResultsMessage } from '../NoResultsMessage/NoResultsMessage';
import { useSearchParams } from '../../../../hooks';

export const Preview = ({ id, title, isInitial, bulkDetails }) => {
  const {
    criteria,
    queryRecordType,
    step,
    currentRecordType,
    progress,
  } = useSearchParams();

  const totalRecords = step === EDITING_STEPS.COMMIT ? bulkDetails?.processedNumOfRecords : bulkDetails?.matchedNumOfRecords;
  const anotherCriteriaInProgress = progress && criteria !== progress;
  const isPreviewEnabled = !anotherCriteriaInProgress && Boolean(id);

  const {
    countOfRecords,
    countOfErrors,
    totalCount,
    visibleColumns,
  } = useBulkOperationStats({ bulkDetails, step });

  const {
    pagination,
    changePage,
  } = usePagination(PAGINATION_CONFIG);

  const { contentData, columns, columnMapping, isFetching } = useRecordsPreview({
    key: RECORDS_PREVIEW_KEY,
    capabilities: currentRecordType,
    id,
    step,
    criteria,
    queryRecordType,
    queryOptions: {
      enabled: isPreviewEnabled,
    },
    ...pagination,
  });

  const { data } = useErrorsPreview({
    id,
    queryOptions: {
      enabled: isPreviewEnabled,
    },
  });

  const errors = data?.errors || [];

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
              totalRecords={totalRecords}
              isInitial={isInitial}
              columns={columns}
              contentData={contentData}
              columnMapping={columnMapping}
              visibleColumns={visibleColumns}
              step={step}
              onChangePage={changePage}
              pagination={pagination}
              isFetching={isFetching}
            />
          )}

          {Boolean(errors?.length) && (
            <ErrorsAccordion
              errors={errors}
              entries={totalCount}
              matched={countOfRecords}
              countOfErrors={countOfErrors}
              isInitial={isInitial}
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
    fqlQuery: PropTypes.string
  }),
};
