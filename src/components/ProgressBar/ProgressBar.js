import React, { useContext, useEffect } from 'react';
import { useParams } from 'react-router';
import { useLocation } from 'react-router-dom';
import { FormattedMessage, useIntl } from 'react-intl';

import { Icon, Loading } from '@folio/stripes/components';

import { useShowCallout } from '@folio/stripes-acq-components';

import { useBulkOperationDetails } from '../../hooks/api';
import { ERRORS, JOB_STATUSES } from '../../constants';
import { getBulkOperationStep } from './utils';

import css from './ProgressBar.css';
import { RootContext } from '../../context/RootContext';

export const ProgressBar = () => {
  const callout = useShowCallout();
  const { inAppCommitted } = useContext(RootContext);
  const intl = useIntl();

  const location = useLocation();
  const search = new URLSearchParams(location.search);
  const processedTitle = search.get('processedFileName');
  const title = search.get('fileName');
  const step = search.get('step');

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

  const swwCallout = () => {
    callout({
      type: 'error',
      message:errorMessage?.includes(ERRORS.TOKEN) ? <FormattedMessage id="ui-bulk-edit.error.incorrectFormatted" values={{ fileName:title }} />
        :
        intl.formatMessage({ id: 'ui-bulk-edit.error.sww' }),
    });
  };

  useEffect(() => {
    const nextStep = getBulkOperationStep(bulkDetails);

    if (nextStep) {
      clearIntervalAndRedirect(`/bulk-edit/${id}/preview`, { step: nextStep });
    }

    if (status === JOB_STATUSES.FAILED) {
      swwCallout();
      clearIntervalAndRedirect('/bulk-edit', '');
    }
  }, [status]);

  return (
    <div className={css.progressBar}>
      <div className={css.progressBarTitle}>
        <Icon
          icon="edit"
          size="small"
        />
        <div className={css.progressBarTitleText}>
          {inAppCommitted ?
            <FormattedMessage
              id="ui-bulk-edit.progressBar.committing"
            />
            :
            <FormattedMessage
              id="ui-bulk-edit.progressBar.title"
              values={{ title: title || processedTitle }}
            />}
        </div>
      </div>
      <div className={css.progressBarBody}>
        <div className={css.progressBarLine}>
          <div data-testid="progress-line" style={{ width: `${progressPercentage}%` }} />
        </div>
        <div className={css.progressBarLineStatus}>
          <span>
            {inAppCommitted ?
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
