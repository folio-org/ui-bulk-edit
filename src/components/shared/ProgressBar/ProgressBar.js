import React, { useCallback, useEffect } from 'react';
import { useParams } from 'react-router';
import { FormattedMessage, useIntl } from 'react-intl';

import { Icon, Loading } from '@folio/stripes/components';
import { useShowCallout } from '@folio/stripes-acq-components';

import { useBulkOperationDetails } from '../../../hooks/api';
import { EDITING_STEPS, ERRORS, JOB_STATUSES } from '../../../constants';
import { getBulkOperationStep } from './utils';
import css from './ProgressBar.css';
import { useSearchParams } from '../../../hooks/useSearchParams';

export const ProgressBar = () => {
  const callout = useShowCallout();
  const intl = useIntl();
  const {
    processedFileName,
    initialFileName,
    step
  } = useSearchParams();
  const { id } = useParams();

  const { bulkDetails, clearIntervalAndRedirect } = useBulkOperationDetails({
    id,
    interval: 1000 * 3,
    additionalQueryKeys: [step],
  });

  const status = bulkDetails?.status;
  const errorMessage = bulkDetails?.errorMessage;
  const progressPercentage = bulkDetails
    ? (bulkDetails.processedNumOfRecords / bulkDetails.totalNumOfRecords) * 100
    : 0;

  const swwCallout = useCallback(() => {
    callout({
      type: 'error',
      message: errorMessage?.includes(ERRORS.TOKEN) ? <FormattedMessage id="ui-bulk-edit.error.incorrectFormatted" values={{ fileName: initialFileName }} />
        :
        intl.formatMessage({ id: 'ui-bulk-edit.error.sww' }),
    });
  }, [
    callout,
    errorMessage,
    initialFileName,
    intl
  ]);

  useEffect(() => {
    const nextStep = getBulkOperationStep(bulkDetails);

    if (nextStep) {
      clearIntervalAndRedirect(`/bulk-edit/${id}/preview`, { step: nextStep, progress: null });
    }

    if (status === JOB_STATUSES.FAILED) {
      swwCallout();
      clearIntervalAndRedirect('/bulk-edit', '');
    }
  }, [
    status,
    bulkDetails,
    id,
    clearIntervalAndRedirect,
    swwCallout
  ]);

  return (
    <div className={css.progressBar}>
      <div className={css.progressBarTitle}>
        <Icon
          icon="edit"
          size="small"
        />
        <div className={css.progressBarTitleText}>
          {step === EDITING_STEPS.UPLOAD ?
            <FormattedMessage
              id="ui-bulk-edit.progressBar.committing"
            />
            :
            <FormattedMessage
              id="ui-bulk-edit.progressBar.title"
              values={{ title: initialFileName || processedFileName }}
            />}
        </div>
      </div>
      <div className={css.progressBarBody}>
        <div className={css.progressBarLine}>
          <div data-testid="progress-line" style={{ width: `${progressPercentage}%` }} />
        </div>
        <div className={css.progressBarLineStatus}>
          <span>
            {step === EDITING_STEPS.UPLOAD ?
              <FormattedMessage id="ui-bulk-edit.progresssBar.processing" />
              :
              <FormattedMessage id="ui-bulk-edit.progresssBar.retrieving" />
            }
          </span>
          <Loading />
        </div>
      </div>
    </div>
  );
};
