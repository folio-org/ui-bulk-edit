import PropTypes from 'prop-types';
import { Headline } from '@folio/stripes/components';

export const Preview = ({ fileUploadedName }) => {
  return (
    <Headline size="large" margin="medium" tag="h3">
        FileName: {fileUploadedName}
    </Headline>
  );
};

Preview.propTypes = {
  fileUploadedName: PropTypes.string,
};
