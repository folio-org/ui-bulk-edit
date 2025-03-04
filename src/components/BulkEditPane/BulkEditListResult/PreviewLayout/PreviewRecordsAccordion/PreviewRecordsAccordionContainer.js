import React from 'react';
import PropTypes from 'prop-types';

import { Layout, Loading } from '@folio/stripes/components';

import { PreviewRecordsAccordion } from './PreviewRecordsAccordion';
import { usePagination } from '../../../../../hooks/usePagination';
import { PAGINATION_CONFIG } from '../../../../../constants';
import { RECORDS_PREVIEW_KEY, useRecordsPreview } from '../../../../../hooks/api';
import { useBulkOperationStats } from '../../../../../hooks/useBulkOperationStats';
import { useSearchParams } from '../../../../../hooks';
import { iseRecordsPreviewAvailable } from '../helpers';

import css from '../Preview.css';


export const PreviewRecordsAccordionContainer = ({ bulkDetails }) => {
  const {
    criteria,
    queryRecordType,
    step,
    currentRecordType,
  } = useSearchParams();

  const {
    countOfRecords,
    visibleColumns,
  } = useBulkOperationStats({ bulkDetails, step });

  const isRecordsPreviewEnabled = iseRecordsPreviewAvailable(bulkDetails, step);

  const {
    pagination: previewPagination,
    changePage: changePreviewPage,
  } = usePagination(PAGINATION_CONFIG);

  const { contentData, columns, columnMapping, isFetching: isPreviewFetching, isLoading: isPreviewLoading } = useRecordsPreview({
    key: RECORDS_PREVIEW_KEY,
    capabilities: currentRecordType,
    id: bulkDetails.id,
    step,
    criteria,
    queryRecordType,
    queryOptions: {
      enabled: isRecordsPreviewEnabled,
    },
    ...previewPagination,
  });

  if (isPreviewLoading) {
    return (
      <Layout className={`flex centerContent ${css.loadingPreviewAccordion}`}>
        <Loading size="large" />
      </Layout>
    );
  }

  if (!contentData?.length) {
    return null;
  }

  return (
    <PreviewRecordsAccordion
      totalRecords={countOfRecords}
      columns={columns}
      contentData={contentData}
      columnMapping={columnMapping}
      visibleColumns={visibleColumns}
      onChangePage={changePreviewPage}
      pagination={previewPagination}
      isFetching={isPreviewFetching}
    />
  );
};

PreviewRecordsAccordionContainer.propTypes = {
  bulkDetails: PropTypes.object.isRequired,
};
