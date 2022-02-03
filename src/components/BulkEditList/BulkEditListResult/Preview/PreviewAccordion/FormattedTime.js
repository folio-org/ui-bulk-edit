import { useIntl } from 'react-intl';
import PropTypes from 'prop-types';

import { NoValue } from '@folio/stripes/components';

export const FormattedTime = ({ dateString }) => {
  const intl = useIntl();

  return dateString
    ? intl.formatDate(dateString, {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZone: 'UTC',
    })
    : <NoValue />;
};

FormattedTime.propTypes = {
  dateString: PropTypes.string,
};

