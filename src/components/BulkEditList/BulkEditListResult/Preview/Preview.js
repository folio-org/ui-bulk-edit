import PropTypes from 'prop-types';
import { Headline, MessageBanner } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';

export const Preview = ({ fileUploadedName }) => {
  return (
    <>
      {/* <MessageBanner type="success" contentClassName="SuccessBanner">
        <FormattedMessage
          id="ui-bulk-edit.recordsSuccessfullyChanged"
          values={{ value: fileUploadedName }}
        />
      </MessageBanner> */}
      <Headline size="large" margin="medium" tag="h3">
              FileName: {fileUploadedName}
      </Headline>
    </>
  );
};

Preview.propTypes = {
  fileUploadedName: PropTypes.string,
};
