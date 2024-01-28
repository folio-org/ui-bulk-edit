import { FormattedMessage } from 'react-intl';
import {
  Headline,
  AccordionStatus,
  MessageBanner,
} from '@folio/stripes/components';
import PropTypes from 'prop-types';
import { useLocation } from 'react-router-dom';
import css from './Preview.css';
import { PreviewAccordion } from './PreviewAccordion';
import { ErrorsAccordion } from './ErrorsAccordion';
import {
  RECORDS_PREVIEW_KEY,
  useErrorsPreview,
  useRecordsPreview
} from '../../../../hooks/api';

import { PAGINATION_CONFIG } from '../../../../constants';
import { usePagination } from '../../../../hooks/usePagination';
import { useBulkOperationStats } from '../../../../hooks/useBulkOperationStats';

export const Preview = ({ id, title, isInitial, bulkDetails }) => {
  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const step = search.get('step');
  const capabilities = search.get('capabilities');

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
    id,
    step,
    capabilities,
    ...pagination,
  });

  const { data } = useErrorsPreview({ id });

  const errors = data?.errors || [];

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
              totalRecords={bulkDetails?.matchedNumOfRecords}
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
