import { render, screen, waitFor } from '@folio/jest-config-stripes/testing-library/react';
import { useStripes } from '@folio/stripes/core';

import { BulkEditSettings } from './BulkEditSettings';
import { useBulkPermissions } from '../hooks';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useStripes: jest.fn(),
  AppIcon: ({ children }) => <span>{children}</span>,
  TitleManager: ({ children, page }) => (
    <>
      <head>
        <title>{page}</title>
      </head>
      {children}
    </>
  ),
}));

jest.mock('@folio/stripes/smart-components', () => ({
  ...jest.requireActual('@folio/stripes/smart-components'),
  Settings: ({ sections, paneTitle }) => (
    <div>
      <h1>{paneTitle}</h1>
      {sections.map((section, idx) => (
        <div key={idx}>
          <h2>{section.label}</h2>
          <ul>
            {section.pages.map((page, index) => (
              <li key={index}>{page.label}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  )
}));

jest.mock('react-intl', () => ({
  ...jest.requireActual('react-intl'),
  useIntl: () => ({
    formatMessage: ({ id }) => id,
  }),
}));

jest.mock('../hooks', () => ({
  useBulkPermissions: jest.fn(),
}));

const mockStripes = { hasPerm: jest.fn(() => true) };

beforeEach(() => {
  useStripes.mockReturnValue(mockStripes);
});

describe('BulkEditSettings', () => {
  const expectLabel = (label) => {
    expect(screen.getByText(label)).toBeInTheDocument();
  };

  it('renders all menu items when all permissions are granted', () => {
    useBulkPermissions.mockReturnValue({
      hasSettingsViewPerms: true,
      hasInAppViewPerms: true,
      hasInAppUsersEditPerms: true,
      hasCsvViewPerms: true,
    });

    render(<BulkEditSettings />);

    expectLabel('ui-bulk-edit.settings.paneTitle');
    expectLabel('ui-bulk-edit.settings.inventoryProfiles');
    expectLabel('ui-bulk-edit.settings.otherProfiles');
    expectLabel('ui-bulk-edit.settings.holdingsProfiles');
    expectLabel('ui-bulk-edit.settings.instanceProfiles');
    expectLabel('ui-bulk-edit.settings.itemProfiles');
    expectLabel('ui-bulk-edit.settings.userProfiles');
  });

  it('renders only inventory profiles if only in-app edit permission is granted', () => {
    useBulkPermissions.mockReturnValue({
      hasSettingsViewPerms: true,
      hasInAppViewPerms: true,
      hasInAppUsersEditPerms: false,
      hasCsvViewPerms: false,
    });

    render(<BulkEditSettings />);

    expectLabel('ui-bulk-edit.settings.paneTitle');
    expectLabel('ui-bulk-edit.settings.inventoryProfiles');
    expectLabel('ui-bulk-edit.settings.holdingsProfiles');
    expectLabel('ui-bulk-edit.settings.instanceProfiles');
    expectLabel('ui-bulk-edit.settings.itemProfiles');

    expect(screen.queryByText('ui-bulk-edit.settings.otherProfiles')).not.toBeInTheDocument();
    expect(screen.queryByText('ui-bulk-edit.settings.userProfiles')).not.toBeInTheDocument();
  });

  it('renders only other profiles if user or CSV edit permissions are granted', () => {
    useBulkPermissions.mockReturnValue({
      hasSettingsViewPerms: true,
      hasInAppViewPerms: false,
      hasInAppUsersEditPerms: true,
      hasCsvViewPerms: false,
    });

    render(<BulkEditSettings />);

    expectLabel('ui-bulk-edit.settings.paneTitle');
    expectLabel('ui-bulk-edit.settings.otherProfiles');
    expectLabel('ui-bulk-edit.settings.userProfiles');

    expect(screen.queryByText('ui-bulk-edit.settings.inventoryProfiles')).not.toBeInTheDocument();
    expect(screen.queryByText('ui-bulk-edit.settings.holdingsProfiles')).not.toBeInTheDocument();
  });

  it('renders nothing if settings view permission is missing', () => {
    useBulkPermissions.mockReturnValue({
      hasSettingsViewPerms: false,
      hasInAppViewPerms: true,
      hasInAppUsersEditPerms: true,
      hasCsvViewPerms: true,
    });

    render(<BulkEditSettings />);

    expect(screen.queryByText('ui-bulk-edit.settings.inventoryProfiles')).not.toBeInTheDocument();
    expect(screen.queryByText('ui-bulk-edit.settings.otherProfiles')).not.toBeInTheDocument();
    expect(screen.queryByText('ui-bulk-edit.settings.userProfiles')).not.toBeInTheDocument();
  });
});
