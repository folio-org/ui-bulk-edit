import PropTypes from 'prop-types';
import { Icon, Loading } from '@folio/stripes/components';
import { buildSearch } from '@folio/stripes-acq-components';
import { FormattedMessage } from 'react-intl';
import { useLocation, useHistory } from 'react-router-dom';
import { useEffect } from 'react';
import css from './ProgressBar.css';
import { useProgressStatus } from '../../API/useProgressStatus';

export const ProgressBar = ({ updatedId }) => {
  const location = useLocation();
  const history = useHistory();
  const { data } = useProgressStatus(updatedId);
  const title = new URLSearchParams(location.search).get('processedFileName');

  useEffect(() => {
    if (!title) {
      history.replace({
        pathname: location.pathname,
        search: buildSearch({ isCompleted: true }, location.search),
      });
    }
  }, [history, location.pathname, location.search, title]);


  return (
    <div className={css.progressBar}>
      <div className={css.progressBarTitle}>
        <Icon
          icon="edit"
          size="small"
        />
        <div className={css.progressBarTitleText}>{title}</div>
      </div>
      <div className={css.progressBarBody}>
        <div className={css.progressBarLine}>
          <div data-testid="progress-line" style={{ width: `${data?.progress?.progress}%` }} />
        </div>
        <div className={css.progressBarLineStatus}>
          <span><FormattedMessage id="ui-bulk-edit.uploading" /></span>
          <Loading />
        </div>
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  updatedId: PropTypes.string.isRequired,
};

