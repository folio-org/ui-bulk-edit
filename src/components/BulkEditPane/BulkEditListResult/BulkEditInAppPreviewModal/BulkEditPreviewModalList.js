import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, useIntl } from 'react-intl';

import { MessageBanner, MultiColumnList } from '@folio/stripes/components';
import { PrevNextPagination, useShowCallout } from '@folio/stripes-acq-components';

import { Preloader } from '@folio/stripes-data-transfer-components';
import { PREVIEW_COLUMN_WIDTHS } from '../../../PermissionsModal/constants/lists';
import css from './BulkEditInAppPreviewModal.css';
import { usePagination } from '../../../../hooks/usePagination';
import { EDITING_STEPS, PAGINATION_CONFIG } from '../../../../constants';
import { PREVIEW_MODAL_KEY, useRecordsPreview } from '../../../../hooks/api';
import { useSearchParams } from '../../../../hooks';
import { RootContext } from '../../../../context/RootContext';
import { getVisibleColumnsKeys } from '../../../../utils/helpers';


export const BulkEditPreviewModalList = ({
  bulkDetails,
  isPreviewEnabled,
  onPreviewError,
}) => {
  const callout = useShowCallout();
  const intl = useIntl();
  const { visibleColumns } = useContext(RootContext);
  const { currentRecordType } = useSearchParams();
  const {
    pagination,
    changePage,
  } = usePagination(PAGINATION_CONFIG);

  const visibleColumnKeys = getVisibleColumnsKeys(visibleColumns);

  const {
    contentData,
    columnMapping,
    isFetching
  } = useRecordsPreview({
    key: PREVIEW_MODAL_KEY,
    id: bulkDetails?.id,
    step: EDITING_STEPS.EDIT,
    capabilities: currentRecordType,
    queryOptions: {
      enabled: isPreviewEnabled,
      onError: () => {
        callout({
          type: 'error',
          message: intl.formatMessage({ id: 'ui-bulk-edit.error.sww' }),
        });
        onPreviewError();
      },
    },
    ...pagination,
  });

  if (!contentData || !isPreviewEnabled) return <Preloader />;

  return (
    <>
      <MessageBanner type="warning">
        <FormattedMessage id="ui-bulk-edit.previewModal.message" values={{ count: bulkDetails?.processedNumOfRecords }} />
      </MessageBanner>

      <strong className={css.previewModalSubtitle}><FormattedMessage id="ui-bulk-edit.previewModal.previewToBeChanged" /></strong>

      <MultiColumnList
        striped
        contentData={contentData}
        columnMapping={columnMapping}
        visibleColumns={visibleColumnKeys}
        maxHeight={300}
        columnIdPrefix="in-app"
        columnWidths={PREVIEW_COLUMN_WIDTHS}
        loading={isFetching}
      />

      {contentData.length > 0 && (
        <PrevNextPagination
          {...pagination}
          totalCount={bulkDetails?.processedNumOfRecords}
          disabled={false}
          onChange={changePage}
        />
      )}
    </>
  );
};

BulkEditPreviewModalList.propTypes = {
  bulkDetails: PropTypes.object,
  isPreviewEnabled: PropTypes.bool,
  onPreviewError: PropTypes.func,
};
