import PropTypes from 'prop-types';

import { Icon } from '@folio/stripes/components';

import css from './NoResultsMessage.css';

export const NoResultsMessage = ({ children, ...rest }) => {
  return (
    <div className={css.noResultsMessage} {...rest}>
      <div className={css.noResultsMessageLabelWrap}>
        <Icon iconRootClass={css.noResultsMessageIcon} icon="arrow-left" />
        <span className={css.noResultsMessageLabel}>{children}</span>
      </div>
    </div>
  );
};

NoResultsMessage.propTypes = {
  children: PropTypes.node.isRequired,
};

