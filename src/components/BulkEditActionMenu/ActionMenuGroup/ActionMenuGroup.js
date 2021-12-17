import PropTypes from 'prop-types';
import { Headline } from '@folio/stripes/components';
import css from './ActionMenuGroup.css';

export const ActionMenuGroup = ({
  title,
  children,
}) => (
  <div className={css.ActionMenuGroup}>
    <div className={css.ActionMenuGroupTitle}>
      <Headline size="medium" margin="xx-small" faded>
        {title}
      </Headline>
    </div>
    <div className={css.ActionMenuGroupBody}>{children}</div>
  </div>
);

ActionMenuGroup.propTypes = {
  title: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  children: PropTypes.element,
};
