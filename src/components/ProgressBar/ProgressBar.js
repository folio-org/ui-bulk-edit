import { Icon, Loading } from '@folio/stripes/components';
import { FormattedMessage, useIntl } from 'react-intl';
import { useLocation } from 'react-router-dom';
import { useParams } from 'react-router';
import { useEffect } from 'react';
import { useShowCallout } from '@folio/stripes-acq-components';
import css from './ProgressBar.css';
import { useBulkOperationDetails } from '../../hooks/api/useBulkOperationDetails';
import { EDITING_STEPS, JOB_STATUSES } from '../../constants';

export const ProgressBar = () => {
  const callout = useShowCallout();
  const intl = useIntl();
  const location = useLocation();
  const { id } = useParams();
  const { bulkDetails, clearIntervalAndRedirect } = useBulkOperationDetails({
    id,
    interval: 500,
  });

  const processedTitle = new URLSearchParams(location.search).get('processedFileName');
  const title = new URLSearchParams(location.search).get('fileName');
  const status = bulkDetails?.status;
  const progressPercentage = bulkDetails
    ? (bulkDetails.processedNumOfRecords / bulkDetails.totalNumOfRecords) * 100
    : 0;

  const swwCallout = () => {
    callout({
      type: 'error',
      message: intl.formatMessage({ id: 'ui-bulk-edit.error.sww' }),
    });
  };

  useEffect(() => {
    const mappedStatuses = {
      [JOB_STATUSES.DATA_MODIFICATION]: { step: EDITING_STEPS.UPLOAD },
      [JOB_STATUSES.COMPLETED]: { step: EDITING_STEPS.COMMIT },
      [JOB_STATUSES.COMPLETED_WITH_ERRORS]: { step: EDITING_STEPS.UPLOAD },
      [JOB_STATUSES.FAILED]: { step: null, callout: swwCallout },
    };

    const matched = mappedStatuses[status];

    if (matched) {
      clearIntervalAndRedirect(`/bulk-edit/${id}/preview`, {
        ...(matched.step ? { step: matched.step } : {}),
      });

      if (matched.callout) matched.callout();
    }

    if (status === JOB_STATUSES.FAILED) {
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
          <FormattedMessage
            id="ui-bulk-edit.progressBar.title"
            values={{ title: title || processedTitle }}
          />
        </div>
      </div>
      <div className={css.progressBarBody}>
        <div className={css.progressBarLine}>
          <div data-testid="progress-line" style={{ width: `${progressPercentage}%` }} />
        </div>
        <div className={css.progressBarLineStatus}>
          <span><FormattedMessage id="ui-bulk-edit.progresssBar.retrieving" /></span>
          <Loading />
        </div>
      </div>
    </div>
  );
};

