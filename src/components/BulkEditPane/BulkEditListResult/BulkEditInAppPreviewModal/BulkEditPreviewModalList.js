import React, { useContext, useState } from 'react';
import PropTypes from 'prop-types';
import {
  FormattedMessage,
} from 'react-intl';

import {
  MessageBanner,
  MultiColumnList
} from '@folio/stripes/components';
import {
  PrevNextPagination,
} from '@folio/stripes-acq-components';

import { Preloader } from '@folio/stripes-data-transfer-components';
import { PREVIEW_COLUMN_WIDTHS } from '../../../PermissionsModal/constants/lists';
import css from './BulkEditInAppPreviewModal.css';
import { usePagination } from '../../../../hooks/usePagination';
import {
  CAPABILITIES,
  EDITING_STEPS,
  JOB_STATUSES,
  PAGINATION_CONFIG
} from '../../../../constants';
import {
  PREVIEW_MODAL_KEY,
  useBulkOperationDetails,
  useRecordsPreview
} from '../../../../hooks/api';
import { usePathParams, useSearchParams } from '../../../../hooks';
import { RootContext } from '../../../../context/RootContext';
import { getVisibleColumnsKeys } from '../../../../utils/helpers';
import { useErrorMessages } from '../../../../hooks/useErrorMessages';


export const BulkEditPreviewModalList = ({
  onPreviewError,
}) => {
  const { id: bulkOperationId } = usePathParams('/bulk-edit/:id');
  const { visibleColumns } = useContext(RootContext);
  const { currentRecordType } = useSearchParams();
  const { showErrorMessage } = useErrorMessages();
  const {
    pagination,
    changePage,
  } = usePagination(PAGINATION_CONFIG);

  const [previewLoaded, setPreviewLoaded] = useState(false);
  const interval = previewLoaded ? 0 : 1000;
  const { bulkDetails } = useBulkOperationDetails({
    id: bulkOperationId,
    interval,
  });

  const visibleColumnKeys = getVisibleColumnsKeys(visibleColumns);
  const enabled = bulkDetails?.status === JOB_STATUSES.REVIEW_CHANGES;

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
      enabled,
      onSuccess: showErrorMessage,
      onError: (error) => {
        showErrorMessage(error);
        onPreviewError();
      },
      onSettled: () => {
        setPreviewLoaded(true);
      }
    },
    ...pagination,
  });

  if (!contentData) return <Preloader />;

  const renderMessageBanner = () => {
    if (!bulkDetails?.processedNumOfRecords && currentRecordType === CAPABILITIES.INSTANCE) {
      return (
        <MessageBanner type="warning">
          <FormattedMessage id="ui-bulk-edit.previewModal.message.empty.marc" />
        </MessageBanner>
      );
    }

    return (
      <MessageBanner type="warning">
        <FormattedMessage id="ui-bulk-edit.previewModal.message" values={{ count: bulkDetails?.processedNumOfRecords }} />
      </MessageBanner>
    );
  };

  return (
    <>
      {renderMessageBanner()}

      <strong className={css.previewModalSubtitle}><FormattedMessage
        id="ui-bulk-edit.previewModal.previewToBeChanged"
      />
      </strong>

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
  onPreviewError: PropTypes.func,
};
