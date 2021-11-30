import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { Layout } from '@folio/stripes/components';
import {
  FileUploader,
  Preloader,
} from '@folio/stripes-data-transfer-components';

export const ListFileUploader = (
  {
    isDropZoneActive,
    isLoading,
    handleDragEnter,
    handleDragLeave,
    handleDrop,
    selectedIdentifier,
  },
) => {
  const uploaderTitle = isDropZoneActive ? isLoading
    ? <Preloader message={<FormattedMessage id="ui-bulk-edit.uploading" />} />
    : <FormattedMessage id="ui-bulk-edit.uploaderActiveTitle" />
    : <FormattedMessage id="ui-bulk-edit.uploaderTitle" />;

  const usploderSubTitle = (
    <FormattedMessage
      id="ui-bulk-edit.uploaderSubTitle"
      values={{
        identifier: selectedIdentifier,
      }}
    />
  );

  return (
    <div style={{ marginBottom: '15px' }}>
      <FileUploader
        multiple={false}
        title={uploaderTitle}
        uploadButtonText={<FormattedMessage id="ui-bulk-edit.uploaderBtnText" />}
        isDropZoneActive={isDropZoneActive}
        disabled={!selectedIdentifier}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        marginBottom
      >
        <>
          <Layout className="padding-top-gutter padding-start-gutter padding-end-gutter textCentered">
            <span data-test-sub-title>
              {usploderSubTitle}
            </span>
          </Layout>
        </>
      </FileUploader>
    </div>
  );
};


ListFileUploader.propTypes = {
  isDropZoneActive: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
  handleDragEnter: PropTypes.func.isRequired,
  handleDragLeave: PropTypes.func.isRequired,
  handleDrop: PropTypes.func.isRequired,
  selectedIdentifier: PropTypes.string,
};
