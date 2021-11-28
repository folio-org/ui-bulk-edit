import PropTypes from 'prop-types';
import { Headline } from '@folio/stripes/components';

import { NoResultsMessage } from './NoResultsMessage/NoResultsMessage';

export const BulkEditListResult = ({ fileUploadedName }) => {
  return (
    fileUploadedName ?
      <Headline size="large" margin="medium" tag="h3">
        FileName: {fileUploadedName}
      </Headline> :
      <NoResultsMessage />
  );
};

BulkEditListResult.propTypes = {
  fileUploadedName: PropTypes.string,
};
