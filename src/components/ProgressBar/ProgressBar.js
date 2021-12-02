import PropTypes from 'prop-types';
import { Icon, Loading } from '@folio/stripes/components';
import css from './ProgressBar.css';

export const ProgressBar = ({ progress = 0, title }) => {
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
          <div data-testid="progress-line" style={{ width: `${progress}%` }} />
        </div>
        <div className={css.progressBarLineStatus}>
          <span>Uploading</span>
          <Loading />
        </div>
      </div>
    </div>
  );
};

ProgressBar.propTypes = {
  progress: PropTypes.number,
  title: PropTypes.string.isRequired,
};

