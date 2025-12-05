import React from 'react';
import PropTypes from 'prop-types';

import { Layout, Loading } from '@folio/stripes/components';

import { PreviewErrorsAccordion } from './PreviewErrorsAccordion';
import { usePagination } from '../../../../../hooks/usePagination';
import { ERRORS_PAGINATION_CONFIG } from '../../../../../constants';
import { useErrorsPreview } from '../../../../../hooks/api';
import { useErrorType } from '../../../../../hooks/useErrorType';
import { useSearchParams } from '../../../../../hooks';
import { getBulkOperationStatsByStep, isErrorsPreviewAvailable } from '../helpers';

import css from '../Preview.css';


export const PreviewErrorsAccordionContainer = ({ bulkDetails }) => {
  const { step } = useSearchParams();
  const { countOfErrors, countOfWarnings } = getBulkOperationStatsByStep(bulkDetails, step);

  const { errorType, toggleShowWarnings } = useErrorType({
    countOfErrors,
    countOfWarnings
  });

  const hasErrorType = errorType !== null;
  const isErrorsPreviewEnabled = hasErrorType && isErrorsPreviewAvailable(bulkDetails, step);

  const {
    pagination: errorsPagination,
    changePage: changeErrorPage,
  } = usePagination(ERRORS_PAGINATION_CONFIG);

  const { errors, isFetching: isErrorsFetching, totalErrorRecords, isLoading: isErrorsLoading } = useErrorsPreview({
    id: bulkDetails.id,
    step,
    errorType,
    enabled: isErrorsPreviewEnabled,
    ...errorsPagination,
  });

  const handleToggleWarnings = () => {
    changeErrorPage(ERRORS_PAGINATION_CONFIG);
    toggleShowWarnings();
  };

  if (isErrorsLoading) {
    return (
      <Layout className={`flex centerContent ${css.loadingPreviewAccordion}`}>
        <Loading size="large" />
      </Layout>
    );
  }

  if (!errors?.length) {
    return null;
  }

  return (
    <PreviewErrorsAccordion
      errors={errors}
      totalErrorRecords={totalErrorRecords}
      totalErrors={countOfErrors}
      totalWarnings={countOfWarnings}
      errorType={errorType}
      onChangePage={changeErrorPage}
      onShowWarnings={handleToggleWarnings}
      pagination={errorsPagination}
      isFetching={isErrorsFetching}
    />
  );
};

PreviewErrorsAccordionContainer.propTypes = {
  bulkDetails: PropTypes.object.isRequired,
};
