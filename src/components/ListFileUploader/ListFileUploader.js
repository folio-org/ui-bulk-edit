import { useState } from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';

import {
  Layout,
  ConfirmationModal,
} from '@folio/stripes/components';
import {
  FileUploader,
  Preloader,
} from '@folio/stripes-data-transfer-components';

import css from './ListFileUploader.css';
import { getFileInfo } from '../BulkEditList/BulkEditListFilters/utils/getFileInfo';

const ListFileUploader = (
  {
    isDropZoneActive,
    isLoading,
    handleDrop,
    isDropZoneDisabled,
    handleDragEnter,
    disableUploader,
    handleDragLeave,
    uploaderSubTitle,
    className,

  },
) => {
  const [fileExtensionModalOpen, setFileExtensionModalOpen] = useState(false);
  const [fileExtensionModalMessage, setFileExtensionModalMessage] = useState('');

  const uploaderTitle = () => {
    if (isDropZoneActive) {
      return isLoading
        ? <Preloader message={<FormattedMessage id="ui-bulk-edit.uploading" />} />
        : <FormattedMessage id="ui-bulk-edit.uploaderActiveTitle" />;
    } else {
      return <FormattedMessage id="ui-bulk-edit.uploaderTitle" />;
    }
  };

  const showFileExtensionModal = (message) => {
    setFileExtensionModalMessage(message);
    setFileExtensionModalOpen(true);
  };

  const hideFileExtensionModal = () => {
    setFileExtensionModalOpen(false);
    setFileExtensionModalMessage(null);
  };

  const onDrop = (acceptedFiles) => {
    if (!acceptedFiles?.length) {
      handleDrop();

      return showFileExtensionModal('ui-bulk-edit.modal.fileExtensions.blocked.message2');
    } else {
      const fileToUpload = acceptedFiles[0];

      const { isTypeSupported } = getFileInfo(fileToUpload);

      if (!isTypeSupported) {
        handleDrop();
        showFileExtensionModal('ui-bulk-edit.modal.fileExtensions.blocked.message');
      } else {
        handleDrop(fileToUpload);
      }
    }
  };

  return (
    <div className={css[className]}>
      <FileUploader
        disabled={isDropZoneDisabled || disableUploader}
        multiple={false}
        title={uploaderTitle()}
        uploadButtonText={<FormattedMessage id="ui-bulk-edit.uploaderBtnText" />}
        isDropZoneActive={isDropZoneActive}
        onDrop={onDrop}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        {openDialogWindow => (
          <>
            <Layout className="padding-top-gutter padding-start-gutter padding-end-gutter textCentered">
              <span data-test-sub-title>
                {uploaderSubTitle}
              </span>
            </Layout>
            <ConfirmationModal
              id="file-extension-modal"
              data-testid="file-extension-modal"
              open={fileExtensionModalOpen}
              heading={(
                <span data-test-file-extension-modal-header>
                  <FormattedMessage id="ui-bulk-edit.modal.fileExtensions.blocked.header" />
                </span>
              )}
              message={<FormattedMessage id={fileExtensionModalMessage} />}
              confirmLabel={<FormattedMessage id="ui-bulk-edit.modal.fileExtensions.actionButton" />}
              cancelLabel={<FormattedMessage id="ui-bulk-edit.cancel" />}
              onConfirm={() => {
                hideFileExtensionModal();
                openDialogWindow();
              }}
              onCancel={hideFileExtensionModal}
            />
          </>
        )}
      </FileUploader>
    </div>
  );
};

ListFileUploader.propTypes = {
  isDropZoneActive: PropTypes.bool.isRequired,
  disableUploader: PropTypes.bool,
  isLoading: PropTypes.bool.isRequired,
  handleDrop: PropTypes.func.isRequired,
  isDropZoneDisabled: PropTypes.bool,
  handleDragEnter: PropTypes.func.isRequired,
  handleDragLeave: PropTypes.func.isRequired,
  uploaderSubTitle: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.string.isRequired,
  ]),
  className: PropTypes.string.isRequired,
};

export default ListFileUploader;
