import { IntlProvider } from 'react-intl';
import { MemoryRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import { render, screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { BulkEditUpdateProfile } from './BulkEditUpdateProfile';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: jest.fn(),
}));

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  TitleManager: ({ record, children }) => (
    <>
      <div data-testid="title-manager">{record}</div>
      {children}
    </>
  ),
}));

jest.mock('@folio/stripes-data-transfer-components', () => ({
  ...jest.requireActual('@folio/stripes-data-transfer-components'),
  Preloader: () => <div data-testid="preloader" />,
}));

jest.mock('../../hooks/api', () => ({
  useBulkEditProfile: jest.fn(),
}));

jest.mock('../../hooks/api/useProfileUpdate', () => ({
  useProfileUpdate: jest.fn(),
}));

jest.mock('../BulkEditPane/BulkEditListResult/BulkEditInApp/helpers', () => ({
  ruleDetailsToSource: jest.fn(() => 'convertedRuleDetails'),
}));

jest.mock('./forms/BulkEditProfilesForm', () => ({
  BulkEditProfilesForm: jest.fn(
    ({ onSave, onClose, isLoading, title, initialValues, initialRuleDetails, initialMarcRuleDetails }) => (
      <div data-testid="bulk-edit-profiles-form">
        <div data-testid="form-title">{title}</div>
        <div data-testid="form-loading">{String(Boolean(isLoading))}</div>
        <div data-testid="initial-values">{JSON.stringify(initialValues)}</div>
        <div data-testid="initial-rule-details">{JSON.stringify(initialRuleDetails)}</div>
        <div data-testid="initial-marc-rule-details">{JSON.stringify(initialMarcRuleDetails)}</div>
        <button type="button" onClick={() => onSave({ name: 'Updated Name' })}>Save</button>
        <button type="button" onClick={onClose}>Close</button>
      </div>
    )
  ),
}));

jest.mock('../../hooks', () => ({
  useSearchParams: () => ({ currentRecordType: 'USER' }),
}));

describe('BulkEditUpdateProfile', () => {
  const { useParams } = jest.requireMock('react-router');
  const { useBulkEditProfile } = jest.requireMock('../../hooks/api');
  const { useProfileUpdate } = jest.requireMock('../../hooks/api/useProfileUpdate');
  const { ruleDetailsToSource } = jest.requireMock(
    '../BulkEditPane/BulkEditListResult/BulkEditInApp/helpers'
  );

  const defaultProps = { onClose: jest.fn() };

  const mockProfile = {
    id: 'profile-42',
    name: 'Profile to Edit',
    description: 'Existing description',
    locked: true,
    ruleDetails: [{ field: 'email', action: 'REPLACE_WITH', actions: [] }],
    marcRuleDetails: [{ field: '100', subfield: 'a', action: 'ADD' }],
  };

  const renderComponent = (props = {}) => render(
    <IntlProvider locale="en">
      <QueryClientProvider client={new QueryClient()}>
        <MemoryRouter>
          <BulkEditUpdateProfile {...defaultProps} {...props} />
        </MemoryRouter>
      </QueryClientProvider>
    </IntlProvider>
  );

  beforeEach(() => {
    useParams.mockReturnValue({ id: 'profile-42' });

    useBulkEditProfile.mockReturnValue({
      profile: mockProfile,
      isLoading: false,
    });

    useProfileUpdate.mockReturnValue({
      updateProfile: jest.fn(),
      isProfileUpdating: false,
    });
  });

  it('shows Preloader while profile is loading', () => {
    useBulkEditProfile.mockReturnValue({
      profile: undefined,
      isLoading: true,
    });

    renderComponent();

    expect(screen.getByTestId('preloader')).toBeInTheDocument();
    expect(screen.queryByTestId('bulk-edit-profiles-form')).not.toBeInTheDocument();
  });

  it('renders the form when profile is loaded', () => {
    renderComponent();

    expect(screen.getByTestId('bulk-edit-profiles-form')).toBeInTheDocument();
  });

  it('sets TitleManager record to the profile name', () => {
    renderComponent();

    expect(screen.getByTestId('title-manager')).toHaveTextContent('Profile to Edit');
  });

  it('passes title and initial values to the form', () => {
    renderComponent();

    expect(screen.getByTestId('form-title')).toHaveTextContent('Profile to Edit');

    const initialValues = JSON.parse(screen.getByTestId('initial-values').textContent);
    expect(initialValues).toEqual({
      name: mockProfile.name,
      description: mockProfile.description,
      locked: mockProfile.locked,
      entityType: 'USER',
    });
  });

  it('passes converted rule details and marc rule details to the form', () => {
    renderComponent();

    expect(ruleDetailsToSource).toHaveBeenCalledWith(mockProfile.ruleDetails, 'USER');

    const ruleDetails = JSON.parse(screen.getByTestId('initial-rule-details').textContent);
    expect(ruleDetails).toBe('convertedRuleDetails');

    const marcRuleDetails = JSON.parse(screen.getByTestId('initial-marc-rule-details').textContent);
    expect(marcRuleDetails).toEqual(mockProfile.marcRuleDetails);
  });

  it('reflects isProfileUpdating as isLoading on the form', () => {
    useProfileUpdate.mockReturnValue({
      updateProfile: jest.fn(),
      isProfileUpdating: true,
    });

    renderComponent();

    expect(screen.getByTestId('form-loading')).toHaveTextContent('true');
  });

  it('calls updateProfile on save', async () => {
    const mockUpdate = jest.fn();
    useProfileUpdate.mockReturnValue({
      updateProfile: mockUpdate,
      isProfileUpdating: false,
    });

    renderComponent();

    await userEvent.click(screen.getByText('Save'));

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith({ name: 'Updated Name' });
    });
  });

  it('calls onClose when Close is clicked', async () => {
    const onClose = jest.fn();

    renderComponent({ onClose });

    await userEvent.click(screen.getByText('Close'));

    expect(onClose).toHaveBeenCalled();
  });

  it('uses id from params to fetch and update the profile', () => {
    useParams.mockReturnValue({ id: 'abc-999' });

    renderComponent();

    expect(useBulkEditProfile).toHaveBeenCalledWith('abc-999');
    expect(useProfileUpdate).toHaveBeenCalledWith({
      id: 'abc-999',
      onSuccess: defaultProps.onClose,
    });
  });
});
