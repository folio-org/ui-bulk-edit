import React from 'react';
import { render, screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';

import '../../../../../test/jest/__mock__';

import { BulkEditPreviewModalFooter } from './BulkEditPreviewModalFooter';
import { useSearchParams } from '../../../../hooks';
import {
  QUERY_KEY_DOWNLOAD_ADMINISTRATIVE_PREVIEW_MODAL,
  QUERY_KEY_DOWNLOAD_MARC_PREVIEW_MODAL,
  useFileDownload
} from '../../../../hooks/api';
import { APPROACHES } from '../../../../constants';
import { RootContext } from '../../../../context/RootContext';

jest.mock('../../../../hooks', () => ({
  useSearchParams: jest.fn(),
}));

jest.mock('../../../../hooks/api', () => ({
  useFileDownload: jest.fn(),
}));

const mockSavePreviewFile = jest.fn();

jest.mock('../../../../utils/files', () => ({
  savePreviewFile: jest.fn((...args) => mockSavePreviewFile(...args)),
  changeExtension: (name, ext) => `${name}.${ext}`,
}));

const renderModalFooter = (overwrite = {}) => {
  const contextValue = {
    visibleColumns: [],
  };

  return render(
    <RootContext.Provider value={contextValue}>
      <BulkEditPreviewModalFooter
        bulkDetails={{ id: '123' }}
        buttonsDisabled
        onKeepEditing={jest.fn()}
        onCommitChanges={jest.fn()}
        {...overwrite}
      />
    </RootContext.Provider>
  );
};

describe('BulkEditPreviewModalFooter', () => {
  let mockDownloadCsvPreview;
  let mockDownloadMarcPreview;

  beforeEach(() => {
    mockDownloadCsvPreview = jest.fn();
    mockDownloadMarcPreview = jest.fn();

    useSearchParams.mockReturnValue({ approach: APPROACHES.MARC, initialFileName: 'testFile' });

    useFileDownload.mockImplementation(({ queryKey }) => {
      if (queryKey === QUERY_KEY_DOWNLOAD_ADMINISTRATIVE_PREVIEW_MODAL) {
        return { refetch: mockDownloadCsvPreview };
      }
      if (queryKey === QUERY_KEY_DOWNLOAD_MARC_PREVIEW_MODAL) {
        return { refetch: mockDownloadMarcPreview };
      }
      return {};
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders all buttons correctly', () => {
    renderModalFooter();

    expect(screen.getByText('ui-bulk-edit.previewModal.keepEditing')).toBeInTheDocument();
    expect(screen.getByText('ui-bulk-edit.previewModal.downloadPreview')).toBeInTheDocument();
    expect(screen.getByText('ui-bulk-edit.previewModal.downloadPreview.marc')).toBeInTheDocument();
    expect(screen.getByText('ui-bulk-edit.previewModal.saveAndClose')).toBeInTheDocument();
  });

  it('handles the keep editing button click', () => {
    const onKeepEditingMock = jest.fn();
    renderModalFooter({ onKeepEditing: onKeepEditingMock });

    fireEvent.click(screen.getByText('ui-bulk-edit.previewModal.keepEditing'));
    expect(onKeepEditingMock).toHaveBeenCalled();
  });

  it('handles the save and close button click', () => {
    const onCommitChangesMock = jest.fn();

    renderModalFooter({ onCommitChanges: onCommitChangesMock, buttonsDisabled: false });

    fireEvent.click(screen.getByText('ui-bulk-edit.previewModal.saveAndClose'));

    expect(onCommitChangesMock).toHaveBeenCalled();
  });

  it('downloads CSV preview on button click', () => {
    renderModalFooter({ buttonsDisabled: false });

    fireEvent.click(screen.getByText('ui-bulk-edit.previewModal.downloadPreview'));
    expect(mockDownloadCsvPreview).toHaveBeenCalled();
  });

  it('disables buttons when buttonsDisabled is true', () => {
    renderModalFooter();

    expect(screen.getByRole('button', { name: 'ui-bulk-edit.previewModal.keepEditing' })).not.toBeDisabled();
    expect(screen.getByRole('button', { name: 'ui-bulk-edit.previewModal.downloadPreview' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'ui-bulk-edit.previewModal.downloadPreview.marc' })).toBeDisabled();
    expect(screen.getByRole('button', { name: 'ui-bulk-edit.previewModal.saveAndClose' })).toBeDisabled();
  });

  it('should not render download marc if approach is not MARC', () => {
    useSearchParams.mockReturnValue({ approach: APPROACHES.IN_APP, initialFileName: 'testFile' });

    renderModalFooter();

    expect(screen.queryByText('ui-bulk-edit.previewModal.downloadPreview.marc')).not.toBeInTheDocument();
  });
});
