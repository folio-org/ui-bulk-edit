import PropTypes from 'prop-types';
import { Icon, Loading } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import css from './ProgressBar.css';
import { useProgressStatus } from '../../API/useProgressStatus';

export const ProgressBar = ({ updatedId, title }) => {
  const { data } = useProgressStatus(updatedId);

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
  title: PropTypes.string.isRequired,
};

