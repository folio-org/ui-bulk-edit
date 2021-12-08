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

export const ListFileUploader = (
  { isDropZoneActive,
    isLoading,
    handleDrop,
    fileExtensionModalOpen,
    hideFileExtensionModal,
    isDropZoneDisabled,
    recordIdentifier,
    handleDragEnter,
    handleDragLeave },
) => {
  const uploaderTitle = isDropZoneActive ? isLoading
    ? <Preloader message={<FormattedMessage id="ui-bulk-edit.uploading" />} />
    : <FormattedMessage id="ui-bulk-edit.uploaderActiveTitle" />
    : <FormattedMessage id="ui-bulk-edit.uploaderTitle" />;

  const usploderSubTitle = (
    <FormattedMessage
      id={`ui-bulk-edit.uploaderSubTitle${recordIdentifier ? `.${recordIdentifier}` : ''}`}
    />
  );

  return (
    <div className={css.FileUploaderContainer}>
      <FileUploader
        disabled={isDropZoneDisabled}
        multiple={false}
        title={uploaderTitle}
        uploadButtonText={<FormattedMessage id="ui-bulk-edit.uploaderBtnText" />}
        isDropZoneActive={isDropZoneActive}
        onDrop={handleDrop}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
      >
        {openDialogWindow => (
          <>
            <Layout className="padding-top-gutter padding-start-gutter padding-end-gutter textCentered">
              <span data-test-sub-title>
                {usploderSubTitle}
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
              message={<FormattedMessage id="ui-bulk-edit.modal.fileExtensions.blocked.message" />}
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
  isLoading: PropTypes.bool.isRequired,
  handleDrop: PropTypes.func.isRequired,
  fileExtensionModalOpen: PropTypes.bool.isRequired,
  hideFileExtensionModal: PropTypes.func.isRequired,
  isDropZoneDisabled: PropTypes.bool.isRequired,
  recordIdentifier: PropTypes.string.isRequired,
  handleDragEnter: PropTypes.func.isRequired,
  handleDragLeave: PropTypes.func.isRequired,
};
