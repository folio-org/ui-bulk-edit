import {
  render,
  screen,
} from '@folio/jest-config-stripes/testing-library/react';
import userEvent from '@folio/jest-config-stripes/testing-library/user-event';
import { runAxeTest } from '@folio/stripes-testing';
import { handleKeyCommand } from '@folio/stripes-acq-components';

import { CAPABILITIES } from '../../constants';
import { useBulkEditProfile } from '../../hooks/api';
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
  <BulkEditProfileDetails
    {...defaultProps}
    {...props}
  />,
);

describe('BulkEditProfileDetails', () => {
  beforeEach(() => {
    useBulkEditProfile.mockReturnValue({ profile: profileMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
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
});
