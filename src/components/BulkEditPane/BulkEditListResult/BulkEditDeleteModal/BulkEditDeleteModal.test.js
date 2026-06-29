import { render, screen, fireEvent } from '@folio/jest-config-stripes/testing-library/react';

import { useStartBulkDelete } from '../../../../hooks';
import BulkEditDeleteModal from './BulkEditDeleteModal';

jest.mock('@folio/stripes/components', () => ({
  // eslint-disable-next-line react/prop-types
  ConfirmationModal: ({ open, heading, message, confirmLabel, onConfirm, onCancel, isConfirmButtonDisabled }) => (open ? (
    <div data-testid="delete-modal">
      <div>{heading}</div>
      <div>{message}</div>
      <button type="button" disabled={isConfirmButtonDisabled} onClick={onConfirm}>{confirmLabel}</button>
      <button type="button" onClick={onCancel}>cancel</button>
    </div>
  ) : null),
  // eslint-disable-next-line react/prop-types
  MessageBanner: ({ children, type }) => <div data-testid="message-banner" data-type={type}>{children}</div>,
}));

jest.mock('../../../../hooks', () => ({
  useStartBulkDelete: jest.fn(),
}));

describe('BulkEditDeleteModal', () => {
  const mockStartBulkDelete = jest.fn();
  const defaultProps = {
    open: true,
    bulkOperationId: '123',
    countOfRecords: 5,
    onClose: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useStartBulkDelete.mockReturnValue({ startBulkDelete: mockStartBulkDelete, isDeleting: false });
  });

  it('should render the confirmation modal when open', () => {
    render(<BulkEditDeleteModal {...defaultProps} />);

    expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
    expect(screen.getByText('ui-bulk-edit.start.delete.modal.heading')).toBeInTheDocument();
    expect(screen.getByText('ui-bulk-edit.start.delete.modal.message')).toBeInTheDocument();
    expect(screen.getByText('ui-bulk-edit.start.delete.modal.note')).toBeInTheDocument();
  });

  it('should render the count message inside a warning banner', () => {
    render(<BulkEditDeleteModal {...defaultProps} />);

    const banner = screen.getByTestId('message-banner');

    expect(banner).toHaveAttribute('data-type', 'warning');
    expect(banner).toHaveTextContent('ui-bulk-edit.start.delete.modal.message');
  });

  it('should not render the modal when closed', () => {
    render(<BulkEditDeleteModal {...defaultProps} open={false} />);

    expect(screen.queryByTestId('delete-modal')).not.toBeInTheDocument();
  });

  it('should start the bulk delete on confirm', () => {
    render(<BulkEditDeleteModal {...defaultProps} />);

    fireEvent.click(screen.getByText('ui-bulk-edit.start.delete.modal.confirm'));

    expect(mockStartBulkDelete).toHaveBeenCalled();
  });

  it('should call onClose on cancel', () => {
    render(<BulkEditDeleteModal {...defaultProps} />);

    fireEvent.click(screen.getByText('cancel'));

    expect(defaultProps.onClose).toHaveBeenCalled();
  });

  it('should pass onClose as the onDeleteStarted callback to the start hook', () => {
    render(<BulkEditDeleteModal {...defaultProps} />);

    expect(useStartBulkDelete).toHaveBeenCalledWith({
      bulkOperationId: '123',
      onDeleteStarted: defaultProps.onClose,
    });
  });

  it('should disable confirm button while deleting', () => {
    useStartBulkDelete.mockReturnValue({ startBulkDelete: mockStartBulkDelete, isDeleting: true });

    render(<BulkEditDeleteModal {...defaultProps} />);

    expect(screen.getByText('ui-bulk-edit.start.delete.modal.confirm')).toBeDisabled();
  });
});
