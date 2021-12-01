import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Layout } from '@folio/stripes/components';
import {
  FileUploader,
  Preloader,
} from '@folio/stripes-data-transfer-components';

export const ListFileUploader = ({
  disableUploader,
  isDropZoneActive,
  isLoading,
  handleDragEnter,
  handleDragLeave,
  handleDrop,

}) => {
  const uploaderTitle = isDropZoneActive ? isLoading
    ? <Preloader message={<FormattedMessage id="ui-bulk-edit.uploading" />} />
    : <FormattedMessage id="ui-bulk-edit.uploaderActiveTitle" />
    : <FormattedMessage id="ui-bulk-edit.uploaderTitle" />;

  return (
    <div style={{ marginBottom: '15px' }}>
      <FileUploader
        multiple={false}
        title={uploaderTitle}
        uploadButtonText={<FormattedMessage id="ui-bulk-edit.uploaderBtnText" />}
        isDropZoneActive={isDropZoneActive}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        marginBottom
        disabled={disableUploader}
      >
        <>
          <Layout className="padding-top-gutter padding-start-gutter padding-end-gutter textCentered">
            <span data-test-sub-title>
              <FormattedMessage id="ui-bulk-edit.uploaderSubTitle" />
            </span>
          </Layout>
        </>
      </FileUploader>
    </div>
  );
};


ListFileUploader.propTypes = {
  isDropZoneActive: PropTypes.bool.isRequired,
  disableUploader: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  handleDragEnter: PropTypes.func.isRequired,
  handleDragLeave: PropTypes.func.isRequired,
  handleDrop: PropTypes.func.isRequired,
};
