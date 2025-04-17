import React, { useContext } from 'react';
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
import previewCss from '../PreviewLayout/Preview.css';
import { usePagination } from '../../../../hooks/usePagination';
import {
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
  onPreviewSettled,
  isPreviewSettled,
}) => {
  const { id: bulkOperationId } = usePathParams('/bulk-edit/:id');
  const { visibleColumns } = useContext(RootContext);
  const { currentRecordType } = useSearchParams();
  const { showErrorMessage } = useErrorMessages();
  const {
    pagination,
    changePage,
  } = usePagination(PAGINATION_CONFIG);

  const interval = isPreviewSettled ? 0 : 1000;
  const { bulkDetails } = useBulkOperationDetails({
    id: bulkOperationId,
    interval,
  });

  const visibleColumnKeys = getVisibleColumnsKeys(visibleColumns);
  const enabled = [JOB_STATUSES.REVIEWED_NO_MARC_RECORDS, JOB_STATUSES.REVIEW_CHANGES].includes(bulkDetails?.status);
  const numberOfSupportedEntities = bulkDetails?.processedNumOfRecords;
  const numberOfUnsupportedEntities = bulkDetails?.matchedNumOfRecords - numberOfSupportedEntities;

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
      onError: (error) => {
        showErrorMessage(error);
        onPreviewError();
      },
      onSuccess: onPreviewSettled,
    },
    ...pagination,
  });

  if (!contentData) return <Preloader />;

  const renderMessageBanner = () => {
    if (bulkDetails?.status === JOB_STATUSES.REVIEWED_NO_MARC_RECORDS) {
      return (
        <MessageBanner type="warning">
          <FormattedMessage id="ui-bulk-edit.previewModal.message.empty.notSupported" />
        </MessageBanner>
      );
    }

    if (numberOfSupportedEntities && numberOfUnsupportedEntities) {
      return (
        <MessageBanner type="warning">
          <FormattedMessage
            id="ui-bulk-edit.previewModal.message.empty.partlySupported"
            values={{ numberOfUnsupportedEntities, numberOfSupportedEntities }}
          />
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

      <div className={previewCss.previewAccordionList}>
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
      </div>


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
  onPreviewSettled: PropTypes.func,
  isPreviewSettled: PropTypes.bool,
};
