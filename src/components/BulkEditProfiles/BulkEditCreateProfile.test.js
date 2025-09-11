import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import { render, screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { BulkEditCreateProfile } from './BulkEditCreateProfile';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  TitleManager: ({ record, children }) => (
    <>
      <div data-testid="title-manager">{record}</div>
      {children}
    </>
  ),
}));

jest.mock('./forms/BulkEditProfilesForm', () => ({
  BulkEditProfilesForm: jest.fn(({ onSave, onClose, isLoading, title }) => (
    <div data-testid="bulk-edit-profiles-form">
      <div data-testid="form-title">{title}</div>
      <div data-testid="form-loading">{String(Boolean(isLoading))}</div>
      <button type="button" onClick={() => onSave({ name: 'Test Profile', description: 'Test Description' })}>
        Save
      </button>
      <button type="button" onClick={onClose}>Close</button>
    </div>
  )),
}));

jest.mock('../../hooks/api/useProfileCreate', () => ({
  useProfileCreate: jest.fn(),
}));

jest.mock('../../hooks', () => ({
  useSearchParams: () => ({ currentRecordType: 'USER' }),
}));

describe('BulkEditCreateProfile', () => {
  const { useProfileCreate } = jest.requireMock('../../hooks/api/useProfileCreate');

  const defaultProps = {
    onClose: jest.fn(),
  };

  const renderComponent = (props = {}) => render(
    <IntlProvider locale="en">
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter>
          <BulkEditCreateProfile {...defaultProps} {...props} />
        </MemoryRouter>
      </QueryClientProvider>
    </IntlProvider>
  );

  beforeEach(() => {
    useProfileCreate.mockReturnValue({
      createProfile: jest.fn(),
      isProfileCreating: false,
    });
  });

  it('renders the form', () => {
    renderComponent();

    expect(screen.getByTestId('bulk-edit-profiles-form')).toBeInTheDocument();
  });

  it('wires TitleManager with the expected title (intl id fallback)', () => {
    renderComponent();

    expect(screen.getByTestId('title-manager')).toHaveTextContent('ui-bulk-edit.settings.profiles.title.new');
  });

  it('passes isProfileCreating -> isLoading to the form', () => {
    useProfileCreate.mockReturnValue({
      createProfile: jest.fn(),
      isProfileCreating: true,
    });

    renderComponent();

    expect(screen.getByTestId('form-loading')).toHaveTextContent('true');
  });

  it('calls createProfile on save', async () => {
    const mockCreateProfile = jest.fn();
    useProfileCreate.mockReturnValue({
      createProfile: mockCreateProfile,
      isProfileCreating: false,
    });

    renderComponent();

    await userEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockCreateProfile).toHaveBeenCalledWith({
        name: 'Test Profile',
        description: 'Test Description',
      });
    });
  });

  it('calls onClose when Close is clicked', async () => {
    const onClose = jest.fn();

    renderComponent({ onClose });

    await userEvent.click(screen.getByText('Close'));

    expect(onClose).toHaveBeenCalled();
  });

  it('initializes useProfileCreate with onSuccess set to onClose', () => {
    renderComponent();

    expect(useProfileCreate).toHaveBeenCalledWith({ onSuccess: defaultProps.onClose });
  });
});
