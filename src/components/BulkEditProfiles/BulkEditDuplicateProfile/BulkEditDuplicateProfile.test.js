import { IntlProvider } from 'react-intl';
import { useParams } from 'react-router';
import { MemoryRouter } from 'react-router-dom';
import { QueryClientProvider } from 'react-query';

import { render, screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';

import { useBulkEditProfile, useProfileCreate } from '../../../hooks/api';
import { queryClient } from '../../../../test/jest/utils/queryClient';
import { BulkEditDuplicateProfile } from './BulkEditDuplicateProfile';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: jest.fn()
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

jest.mock('../../../hooks/api', () => ({
  useBulkEditProfile: jest.fn(),
  useProfileCreate: jest.fn()
}));

jest.mock('../forms/BulkEditProfilesForm', () => ({
  BulkEditProfilesForm: jest.fn(({ onSave, onClose }) => (
    <div data-testid="bulk-edit-profiles-form">
      <button type="button" onClick={() => onSave({ name: 'Test Profile', description: 'Test Description' })}>Save</button>
      <button type="button" onClick={onClose}>Close</button>
    </div>
  ))
}));

describe('BulkEditDuplicateProfile', () => {
  const defaultProps = {
    onClose: jest.fn(),
  };

  const mockProfile = {
    id: 'profile-123',
    name: 'Original Profile',
    description: 'Original description',
    locked: false,
    ruleDetails: [{ field: 'email', action: 'REPLACE_WITH', actions: [] }]
  };

  const renderComponent = (props = {}) => {
    return render(
      <IntlProvider locale="en">
        <QueryClientProvider client={queryClient}>
          <MemoryRouter>
            <BulkEditDuplicateProfile {...defaultProps} {...props} />
          </MemoryRouter>
        </QueryClientProvider>
      </IntlProvider>
    );
  };

  beforeEach(() => {
    useParams.mockReturnValue({ id: 'profile-123' });

    useBulkEditProfile.mockReturnValue({
      profile: mockProfile,
      isLoading: false
    });

    useProfileCreate.mockReturnValue({
      createProfile: jest.fn(),
      isProfileCreating: false
    });
  });

  describe('Loading state', () => {
    it('should show preloader when profile is loading', () => {
      useBulkEditProfile.mockReturnValue({
        profile: undefined,
        isLoading: true
      });

      renderComponent();

      expect(screen.getByTestId('preloader')).toBeInTheDocument();
      expect(screen.queryByTestId('bulk-edit-profiles-form')).not.toBeInTheDocument();
    });

    it('should render BulkEditProfilesForm when profile is loaded', () => {
      renderComponent();

      expect(screen.getByTestId('bulk-edit-profiles-form')).toBeInTheDocument();
      expect(screen.queryByTestId('preloader')).not.toBeInTheDocument();
    });
  });

  describe('Form interactions', () => {
    it('should call createProfile when handleSave is invoked', async () => {
      const mockCreateProfile = jest.fn();
      useProfileCreate.mockReturnValue({
        createProfile: mockCreateProfile,
        isProfileCreating: false
      });

      renderComponent();

      const saveButton = screen.getByText('Save');
      await userEvent.click(saveButton);

      await waitFor(() => {
        expect(mockCreateProfile).toHaveBeenCalledWith({
          name: 'Test Profile',
          description: 'Test Description'
        });
      });
    });

    it('should call onClose when close button is clicked', async () => {
      const mockOnClose = jest.fn();
      renderComponent({ onClose: mockOnClose });

      const closeButton = screen.getByText('Close');
      await userEvent.click(closeButton);

      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  describe('useBulkEditProfile hook setup', () => {
    it('should call useBulkEditProfile with correct profile id from params', () => {
      useParams.mockReturnValue({ id: 'test-profile-id' });

      renderComponent();

      expect(useBulkEditProfile).toHaveBeenCalledWith('test-profile-id');
    });
  });

  describe('Error scenarios', () => {
    it('should handle missing profile gracefully', () => {
      useBulkEditProfile.mockReturnValue({
        profile: undefined,
        isLoading: false
      });

      renderComponent();

      expect(screen.getByTestId('bulk-edit-profiles-form')).toBeInTheDocument();
    });
  });

  describe('TitleManager integration', () => {
    it('should set the correct document title', () => {
      renderComponent();

      const titleElement = screen.getByTestId('title-manager');
      expect(titleElement).toHaveTextContent('ui-bulk-edit.settings.profiles.title.new');
    });
  });
});
