import React from 'react';
import { render, screen, fireEvent, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import BulkEditManualUploadModal from './BulkEditManualUploadModal';


const mockReplace = jest.fn();
jest.mock('react-router-dom', () => ({
  useHistory: () => ({
    replace: mockReplace,
  }),
}));

jest.mock('@folio/stripes/components', () => ({
  Button: ({ children, ...props }) => <button type="button" {...props}>{children}</button>,
  Modal: ({ children, label, open, footer }) => (open ? (
    <div data-testid="modal">
      <div>{label}</div>
      <div>{children}</div>
      <div>{footer}</div>
    </div>
  ) : null),
  ModalFooter: ({ children }) => <div>{children}</div>,
  MessageBanner: ({ children, type }) => (
    <div data-testid={`message-banner-${type}`}>{children}</div>
  ),
}));

jest.mock('@folio/stripes-acq-components', () => ({
  buildSearch: jest.fn(() => '?search=1'),
  useShowCallout: () => jest.fn(),
}));

const mockFileUpload = jest.fn();
const mockBulkOperationStart = jest.fn();
jest.mock('../../../../hooks/api', () => ({
  useUpload: () => ({ fileUpload: mockFileUpload }),
  useBulkOperationStart: () => ({ bulkOperationStart: mockBulkOperationStart, isLoading: false }),
}));

const mockBulkOperationDelete = jest.fn();
jest.mock('../../../../hooks/api/useBulkOperationDelete', () => ({
  useBulkOperationDelete: () => ({ bulkOperationDelete: mockBulkOperationDelete }),
}));

const mockSetQueriesData = jest.fn();
jest.mock('react-query', () => ({
  useQueryClient: () => ({ setQueriesData: mockSetQueriesData }),
}));

jest.mock('../../../../hooks/useSearchParams', () => ({
  useSearchParams: () => ({ identifier: 'id', criteria: 'some-criteria' }),
}));

jest.mock('../../../shared/ListFileUploader', () => ({
  ListFileUploader: (props) => (
    <div data-testid="list-file-uploader">
      <button type="button" onClick={() => props.handleDrop({ name: 'test-file.csv' })}>
        Simulate File Drop
      </button>
    </div>
  ),
}));

describe('BulkEditManualUploadModal', () => {
  const defaultProps = {
    operationId: '123',
    open: true,
    onCancel: jest.fn(),
    setCountOfRecords: jest.fn(),
    countOfRecords: 0,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockBulkOperationStart.mockClear();
  });

  test('renders upload content when no file has been uploaded', () => {
    const { debug } = render(<BulkEditManualUploadModal {...defaultProps} />);

    debug(undefined, Infinity);

    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByTestId('list-file-uploader')).toBeInTheDocument();
    expect(screen.getByText('ui-bulk-edit.modal.next')).toBeDisabled();
  });

  test('handles file drop and shows a success message', async () => {
    mockFileUpload.mockResolvedValueOnce({});
    mockBulkOperationStart.mockResolvedValueOnce({ matchedNumOfRecords: 5 });

    render(<BulkEditManualUploadModal {...defaultProps} />);

    fireEvent.click(screen.getByText('Simulate File Drop'));

    await waitFor(() => {
      expect(screen.getByTestId('message-banner-success')).toHaveTextContent(
        'ui-bulk-edit.modal.successfullMessage'
      );
    });

    expect(defaultProps.setCountOfRecords).toHaveBeenCalledWith(5);
  });

  test('cancel button calls onCancel and bulkOperationDelete when a file is uploaded', async () => {
    mockFileUpload.mockResolvedValueOnce({});
    mockBulkOperationStart.mockResolvedValueOnce({ matchedNumOfRecords: 5 });

    render(<BulkEditManualUploadModal {...defaultProps} />);

    fireEvent.click(screen.getByText('Simulate File Drop'));
    await waitFor(() => {
      expect(screen.getByTestId('message-banner-success')).toBeInTheDocument();
    });

    fireEvent.click(screen.getByText('stripes-components.cancel'));

    expect(defaultProps.onCancel).toHaveBeenCalled();
    expect(mockBulkOperationDelete).toHaveBeenCalledWith({ operationId: '123' });
  });

  test('transitions to confirmation step and handles commit changes', async () => {
    mockFileUpload.mockResolvedValueOnce({});
    mockBulkOperationStart.mockResolvedValueOnce({ matchedNumOfRecords: 5 });

    mockBulkOperationStart.mockResolvedValueOnce({});

    render(<BulkEditManualUploadModal {...defaultProps} countOfRecords={5} />);

    fireEvent.click(screen.getByText('Simulate File Drop'));
    await waitFor(() => {
      expect(screen.getByTestId('message-banner-success')).toBeInTheDocument();
    });

    const nextButton = screen.getByText('ui-bulk-edit.modal.next');
    expect(nextButton).not.toBeDisabled();

    fireEvent.click(nextButton);

    expect(mockBulkOperationStart).toHaveBeenCalledWith({
      approach: 'MANUAL',
      id: '123',
      step: 'EDIT',
    });

    mockBulkOperationStart.mockClear();

    expect(screen.getByTestId('message-banner-warning')).toHaveTextContent(
      'ui-bulk-edit.conformationModal.message'
    );

    const commitButton = screen.getByText('ui-bulk-edit.conformationModal.commitChanges');

    fireEvent.click(commitButton);

    expect(mockBulkOperationStart).toHaveBeenCalledWith({
      approach: 'MANUAL',
      id: '123',
      step: 'COMMIT',
    });
  });
});
