import { MemoryRouter } from 'react-router-dom';
import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { runAxeTest } from '@folio/stripes-testing';
import { handleKeyCommand } from '@folio/stripes-acq-components';

import {
  CAPABILITIES,
  getUserOptions,
} from '../../constants';
import {
  useBulkEditProfile,
  useProfileDelete,
} from '../../hooks/api';
import { useOptionsWithTenants } from '../../hooks/useOptionsWithTenants';
import { BulkEditProfileDetails } from './BulkEditProfileDetails';

jest.unmock('@folio/stripes/components');

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  ViewMetaData: jest.fn(() => <div>ViewMetaData</div>),
}));

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  handleKeyCommand: jest.fn((cb) => { cb?.(); }),
}));

jest.mock('../../hooks/api', () => ({
  useBulkEditProfile: jest.fn(),
  useProfileDelete: jest.fn(),
}));
jest.mock('../../hooks/useOptionsWithTenants', () => ({
  useOptionsWithTenants: jest.fn(),
}));

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useParams: () => ({ id: '123' })
}));

const profileMock = {
  id: '123',
  name: 'Test Profile',
  description: 'This is a test profile',
};

const defaultProps = {
  entityType: CAPABILITIES.USER,
  onClose: jest.fn(),
};

const renderBulkEditProfileDetails = (props = {}) => render(
  <MemoryRouter>
    <BulkEditProfileDetails
      {...defaultProps}
      {...props}
    />,
  </MemoryRouter>
);

describe('BulkEditProfileDetails', () => {
  const deleteProfile = jest.fn(() => Promise.resolve());

  beforeEach(() => {
    useBulkEditProfile.mockReturnValue({ profile: profileMock });
    useOptionsWithTenants.mockReturnValue({ options: getUserOptions(jest.fn()) });
    useProfileDelete.mockReturnValue({ deleteProfile });
  });

  it('should render profiles details', () => {
    renderBulkEditProfileDetails();

    expect(screen.getByText('ui-bulk-edit.settings.profiles.columns.name')).toBeInTheDocument();
    expect(screen.getByText('ui-bulk-edit.settings.profiles.columns.description')).toBeInTheDocument();
  });

  it('should have proper accessibility attributes', async () => {
    const { container } = renderBulkEditProfileDetails();

    await runAxeTest({ rootNode: container });
  });

  it('should disable delete button when profile is locked', () => {
    useBulkEditProfile.mockReturnValue({ profile: { ...profileMock, locked: true } });
    useProfileDelete.mockReturnValue({ deleteProfile, isDeletingProfile: false });
    renderBulkEditProfileDetails();
    expect(screen.queryByLabelText(/button.delete/)).not.toBeInTheDocument();
  });

  it('should enable edit button when profile is locked but user has lock perms', () => {
    useBulkEditProfile.mockReturnValue({ profile: { ...profileMock, locked: true } });
    renderBulkEditProfileDetails({ hasSettingsLockPerms: true });
    expect(screen.getByLabelText(/button.edit/)).toBeInTheDocument();
  });

  it('should handle cancel in confirmation modal', async () => {
    renderBulkEditProfileDetails();
    await userEvent.click(screen.getByRole('button', { name: 'Icon' }));
    await userEvent.click(screen.getByLabelText(/button.delete/));
    await userEvent.click(screen.getByRole('button', { name: /Cancel/i }));
    expect(screen.queryByText(/delete.modal.message/)).not.toBeInTheDocument();
  });

  it('should render with missing profile data', () => {
    useBulkEditProfile.mockReturnValue({ profile: null });
    renderBulkEditProfileDetails();
    expect(screen.getByText(/ui-bulk-edit.settings.profiles.columns.name/)).toBeInTheDocument();
  });

  describe('Shortcuts', () => {
    it('should close the view when Escape key is pressed', async () => {
      renderBulkEditProfileDetails();

      await userEvent.keyboard('{Escape}');

      expect(defaultProps.onClose).toHaveBeenCalled();
    });

    it('should collapse all sections when "collapseAllSections" command is triggered', async () => {
      renderBulkEditProfileDetails();

      await userEvent.keyboard('{Control>}{Alt>}{g}{/Alt}{/Control}');

      expect(handleKeyCommand).toHaveBeenCalledWith(expect.any(Function));
    });

    it('should collapse all sections when "expandAllSections" command is triggered', async () => {
      renderBulkEditProfileDetails();

      await userEvent.keyboard('{Control>}{Alt>}{b}{/Alt}{/Control}');

      expect(handleKeyCommand).toHaveBeenCalledWith(expect.any(Function));
    });
  });

  describe('Actions', () => {
    it('should call handle profile delete when delete action is triggered', async () => {
      renderBulkEditProfileDetails();

      await userEvent.click(screen.getByRole('button', { name: 'Icon' }));
      await userEvent.click(screen.getByLabelText(/button.delete/));

      expect(screen.getByText(/delete.modal.message/)).toBeInTheDocument();

      await userEvent.click(screen.getByRole('button', { name: 'stripes-core.button.delete' }));

      expect(deleteProfile).toHaveBeenCalledWith({ profileId: profileMock.id });
    });
  });
});
