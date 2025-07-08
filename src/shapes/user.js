import PropTypes from 'prop-types';

export const userPropTypeShape = {
  id: PropTypes.string.isRequired,
  username: PropTypes.string.isRequired,
  personal: PropTypes.shape({
    firstName: PropTypes.string,
    lastName: PropTypes.string,
    middleName: PropTypes.string,
    email: PropTypes.string,
  }),
  active: PropTypes.bool.isRequired,
  patronGroup: PropTypes.shape({
    id: PropTypes.string.isRequired,
    group: PropTypes.string.isRequired,
  }),
  barcode: PropTypes.string,
  createdDate: PropTypes.string.isRequired,
  updatedDate: PropTypes.string.isRequired,
};
