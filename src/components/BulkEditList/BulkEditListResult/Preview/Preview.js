import PropTypes from 'prop-types';
import { Headline, MessageBanner } from '@folio/stripes/components';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router';
import { useDownloadLinks } from '../../../../API/useDownloadLinks';

export const Preview = ({ fileUploadedName }) => {
  const { id } = useParams();
  const { data } = useDownloadLinks(id);

  const processed = data?.progress?.processed;

  return (
    <>
      {processed && (
      <MessageBanner type="success" contentClassName="SuccessBanner">
        <FormattedMessage
          id="ui-bulk-edit.recordsSuccessfullyChanged"
          values={{ value: processed }}
        />
      </MessageBanner>)
      }
      {fileUploadedName && (
        <Headline size="large" margin="medium" tag="h3">
                    FileName: {fileUploadedName}
        </Headline>
      )}
    </>
  );
};

Preview.propTypes = {
  fileUploadedName: PropTypes.string,
};
