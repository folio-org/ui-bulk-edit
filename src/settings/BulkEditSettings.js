import { useIntl } from 'react-intl';

import { Settings } from '@folio/stripes/smart-components';
import { AppIcon, TitleManager, useStripes } from '@folio/stripes/core';

import { useBulkPermissions } from '../hooks';

// This component is a placeholder for the actual components that will be used in the settings pages.
const TempComponent = () => {
  return null;
};

export const BulkEditSettings = (props) => {
  const stripes = useStripes();
  const { formatMessage } = useIntl();
  const { hasSettingsViewPerms, hasInAppEditPerms, hasInAppUsersEditPerms, hasCsvEditPerms } = useBulkPermissions();

  const renderMenuGroupLabel = (title) => (
    <TitleManager page={title}>
      {title}
    </TitleManager>
  );

  const renderMenuItemLabel = (iconKey, messageId) => (
    <AppIcon
      app="bulk-edit"
      iconKey={iconKey}
      size="small"
    >
      {formatMessage({ id: `ui-bulk-edit.settings.${messageId}` })}
    </AppIcon>
  );

  const inventoryProfilesSection = hasInAppEditPerms ? [{
    label: renderMenuGroupLabel(formatMessage({ id: 'ui-bulk-edit.settings.inventoryProfiles' })),
    pages: [
      {
        route: 'holdings-profiles',
        label: renderMenuItemLabel('holdings', 'holdingsProfiles'),
        component: TempComponent,
      },
      {
        route: 'instance-profiles',
        label: renderMenuItemLabel('instance', 'instanceProfiles'),
        component: TempComponent,
      },
      {
        route: 'item-profiles',
        label: renderMenuItemLabel('item', 'itemProfiles'),
        component: TempComponent,
      },
    ]
  }] : [];

  const otherProfilesSection = hasCsvEditPerms || hasInAppUsersEditPerms ? [{
    label: renderMenuGroupLabel(formatMessage({ id: 'ui-bulk-edit.settings.otherProfiles' })),
    pages: [
      {
        route: 'user-profiles',
        label: renderMenuItemLabel('user', 'userProfiles'),
        component: TempComponent,
      },
    ]
  }] : [];

  const sections = hasSettingsViewPerms ? [
    ...inventoryProfilesSection,
    ...otherProfilesSection
  ] : [];

  return (
    <Settings
      {...props}
      stripes={stripes}
      sections={sections}
      paneTitle={formatMessage({ id: 'ui-bulk-edit.settings.paneTitle' })}
    />
  );
};
