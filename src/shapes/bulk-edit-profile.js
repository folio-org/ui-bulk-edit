import PropTypes from 'prop-types';

import { CAPABILITIES } from '../constants';

export const bulkEditProfilePropTypeShape = {
  name: PropTypes.string.isRequired,
  description: PropTypes.string,
  locked: PropTypes.bool.isRequired,
  entityType: PropTypes.oneOf(Object.values(CAPABILITIES)).isRequired,
};
