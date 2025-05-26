import { useIntl } from 'react-intl';

import { Settings } from '@folio/stripes/smart-components';
import { AppIcon, TitleManager, useStripes } from '@folio/stripes/core';

import { useBulkPermissions } from '../hooks';
import { HoldingsProfiles } from './profiles/HoldingsProfiles';
import { InstancesProfiles } from './profiles/InstancesProfiles';
import { ItemsProfiles } from './profiles/ItemsProfiles';
import { UsersProfiles } from './profiles/UsersProfiles';

export const BulkEditSettings = (props) => {
  const stripes = useStripes();
  const { formatMessage } = useIntl();
  const { hasSettingsViewPerms, hasInAppEditPerms, hasInAppUsersEditPerms, hasCsvEditPerms } = useBulkPermissions();

  const renderMenuGroupLabel = (title) => (
    <TitleManager page={formatMessage({ id: 'ui-bulk-edit.titleManager.settings' })}>
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
        component: HoldingsProfiles,
      },
      {
        route: 'instances-profiles',
        label: renderMenuItemLabel('instance', 'instanceProfiles'),
        component: InstancesProfiles,
      },
      {
        route: 'items-profiles',
        label: renderMenuItemLabel('item', 'itemProfiles'),
        component: ItemsProfiles,
      },
    ]
  }] : [];

  const otherProfilesSection = hasCsvEditPerms || hasInAppUsersEditPerms ? [{
    label: renderMenuGroupLabel(formatMessage({ id: 'ui-bulk-edit.settings.otherProfiles' })),
    pages: [
      {
        route: 'users-profiles',
        label: renderMenuItemLabel('user', 'userProfiles'),
        component: UsersProfiles
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
