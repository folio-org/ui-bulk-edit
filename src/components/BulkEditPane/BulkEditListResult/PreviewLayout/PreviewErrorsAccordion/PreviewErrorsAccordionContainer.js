import React from 'react';
import PropTypes from 'prop-types';

import { Layout, Loading } from '@folio/stripes/components';

import { PreviewErrorsAccordion } from './PreviewErrorsAccordion';
import { usePagination } from '../../../../../hooks/usePagination';
import { ERRORS_PAGINATION_CONFIG } from '../../../../../constants';
import { useErrorsPreview } from '../../../../../hooks/api';
import { useErrorType } from '../../../../../hooks/useErrorType';
import { useBulkOperationStats } from '../../../../../hooks/useBulkOperationStats';

import css from '../Preview.css';
import { useSearchParams } from '../../../../../hooks';


export const PreviewErrorsAccordionContainer = ({ bulkDetails }) => {
  const id = bulkDetails.id;
  const { step } = useSearchParams();

  const {
    countOfErrors,
    countOfWarnings,
  } = useBulkOperationStats({ bulkDetails, step });

  const { errorType, hasErrorsOrWarnings, toggleShowWarnings } = useErrorType({
    countOfErrors,
    countOfWarnings
  });

  const hasErrorType = errorType !== null;
  const isErrorsPreviewEnabled = hasErrorType && hasErrorsOrWarnings && Boolean(id);

  const {
    pagination: errorsPagination,
    changePage: changeErrorPage,
  } = usePagination(ERRORS_PAGINATION_CONFIG);

  const { errors, isFetching: isErrorsFetching, isLoading: isErrorsLoading } = useErrorsPreview({
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

  if (isErrorsLoading) {
    return (
      <Layout className={`flex centerContent ${css.loadingPreviewAccordion}`}>
        <Loading size="large" />
      </Layout>
    );
  }

  if (errors?.length === 0) {
    return null;
  }

  return (
    <PreviewErrorsAccordion
      errors={errors}
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
