import React, { useEffect, useRef } from 'react';
import { useParams } from 'react-router';
import { FormattedMessage } from 'react-intl';

import { Icon, Loading } from '@folio/stripes/components';
import { Preloader } from '@folio/stripes-data-transfer-components';

import { useBulkOperationDetails } from '../../../hooks/api';
import { JOB_STATUSES } from '../../../constants';
import { getBulkOperationStep } from './utils';
import css from './ProgressBar.css';
import { useSearchParams } from '../../../hooks';
import { useErrorMessages } from '../../../hooks/useErrorMessages';

const PROGRESS_BAR_CONTENT = {
  deleting: {
    icon: 'trash',
    titleId: 'ui-bulk-edit.progressBar.deleting',
    statusId: 'ui-bulk-edit.progressBar.processing',
  },
  committing: {
    icon: 'edit',
    titleId: 'ui-bulk-edit.progressBar.committing',
    statusId: 'ui-bulk-edit.progressBar.processing',
  },
  retrieving: {
    icon: 'edit',
    titleId: 'ui-bulk-edit.progressBar.title',
    statusId: 'ui-bulk-edit.progressBar.retrieving',
  },
};

export const ProgressBar = () => {
  const {
    processedFileName,
    initialFileName,
  } = useSearchParams();
  const { id } = useParams();
  const { showErrorMessage } = useErrorMessages();

  // Captured once on mount so we can tell a fetch that lands here from the previous phase's cached data.
  const mountedAt = useRef(Date.now());

  const { bulkDetails, dataUpdatedAt, clearIntervalAndRedirect } = useBulkOperationDetails({
    id,
    interval: 1000 * 3,
  });

  const status = bulkDetails?.status;
  const progressPercentage = bulkDetails
    ? (bulkDetails.processedNumOfRecords / bulkDetails.totalNumOfRecords) * 100
    : 0;

  const getProgressContent = () => {
    switch (status) {
      case JOB_STATUSES.DELETING_RECORDS:
        return PROGRESS_BAR_CONTENT.deleting;
      case JOB_STATUSES.APPLY_CHANGES:
      case JOB_STATUSES.APPLY_MARC_CHANGES:
        return PROGRESS_BAR_CONTENT.committing;
      default:
        return PROGRESS_BAR_CONTENT.retrieving;
    }
  };

  const { icon, titleId, statusId } = getProgressContent();

  const nextStep = getBulkOperationStep(bulkDetails);
  const isRedirectPending = Boolean(nextStep) || status === JOB_STATUSES.FAILED;
  const hasFetchedSinceMount = dataUpdatedAt > mountedAt.current;

  useEffect(() => {
    if (nextStep) {
      clearIntervalAndRedirect(`/bulk-edit/${id}/preview`, { step: nextStep, progress: null });
    }

    if (status === JOB_STATUSES.FAILED) {
      showErrorMessage(bulkDetails);

      clearIntervalAndRedirect('/bulk-edit', '');
    }
  }, [
    status,
    bulkDetails,
    id,
    nextStep,
    clearIntervalAndRedirect,
    showErrorMessage,
  ]);

  if (!hasFetchedSinceMount || isRedirectPending) {
    return <Preloader />;
  }

  return (
    <div className={css.progressBar}>
      <div className={css.progressBarTitle}>
        <Icon
          icon={icon}
          size="small"
        />
        <div className={css.progressBarTitleText}>
          <FormattedMessage
            id={titleId}
            values={{ title: initialFileName || processedFileName }}
          />
        </div>
      </div>
      <div className={css.progressBarBody}>
        <div className={css.progressBarLine}>
          <div data-testid="progress-line" style={{ width: `${progressPercentage || 0}%` }} />
        </div>
        <div className={css.progressBarLineStatus}>
          <span>
            <FormattedMessage id={statusId} />
          </span>
          <Loading />
        </div>
      </div>
    </div>
  );
};
