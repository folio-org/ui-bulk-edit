import React, { useEffect } from 'react';
import { useParams } from 'react-router';
import { FormattedMessage } from 'react-intl';

import { Icon, Loading } from '@folio/stripes/components';

import { useBulkOperationDetails } from '../../../hooks/api';
import { EDITING_STEPS, JOB_STATUSES } from '../../../constants';
import { getBulkOperationStep } from './utils';
import css from './ProgressBar.css';
import { useSearchParams } from '../../../hooks';
import { useErrorMessages } from '../../../hooks/useErrorMessages';

const PROGRESS_BAR_CONTENT = {
  deleting: {
    icon: 'trash',
    titleId: 'ui-bulk-edit.progressBar.deleting',
    statusId: 'ui-bulk-edit.progressBar.deleting',
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
    step
  } = useSearchParams();
  const { id } = useParams();
  const { showErrorMessage } = useErrorMessages();

  const { bulkDetails, clearIntervalAndRedirect } = useBulkOperationDetails({
    id,
    interval: 1000 * 3,
  });

  const status = bulkDetails?.status;
  const progressPercentage = bulkDetails
    ? (bulkDetails.processedNumOfRecords / bulkDetails.totalNumOfRecords) * 100
    : 0;

  const getProgressContent = () => {
    if (status === JOB_STATUSES.DELETING_RECORDS) return PROGRESS_BAR_CONTENT.deleting;
    if (step === EDITING_STEPS.UPLOAD) return PROGRESS_BAR_CONTENT.committing;

    return PROGRESS_BAR_CONTENT.retrieving;
  };

  const { icon, titleId, statusId } = getProgressContent();

  useEffect(() => {
    const nextStep = getBulkOperationStep(bulkDetails);

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
    clearIntervalAndRedirect,
    showErrorMessage,
  ]);

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
