import { useIntl } from 'react-intl';

import { Settings } from '@folio/stripes/smart-components';
import { AppIcon, TitleManager, useStripes } from '@folio/stripes/core';

import { CommandList, defaultKeyboardShortcuts } from '@folio/stripes/components';
import { useBulkPermissions } from '../hooks';
import { ProfilesContainer } from './profiles/ProfilesContainer';
import { CAPABILITIES, RECORD_TYPES_MAPPING } from '../constants';

export const BulkEditSettings = (props) => {
  const stripes = useStripes();
  const { formatMessage } = useIntl();
  const { hasSettingsViewPerms, hasInAppViewPerms, hasInAppUsersEditPerms, hasCsvViewPerms } = useBulkPermissions();

  const renderMenuGroupLabel = (title) => (
    <TitleManager page={formatMessage({ id: 'ui-bulk-edit.titleManager.settings' })}>
      {title}
    </TitleManager>
  );

  const renderMenuItemLabel = (key) => (
    <AppIcon
      app="bulk-edit"
      iconKey={key}
      size="small"
    >
      {formatMessage({ id: `ui-bulk-edit.settings.${key}` })}
    </AppIcon>
  );

  const inventoryProfilesSection = hasInAppViewPerms ? [{
    label: renderMenuGroupLabel(formatMessage({ id: 'ui-bulk-edit.settings.inventoryProfiles' })),
    pages: [
      {
        route: 'holdings-profiles',
        label: renderMenuItemLabel(RECORD_TYPES_MAPPING[CAPABILITIES.HOLDING]),
        component: () => <ProfilesContainer entityType={CAPABILITIES.HOLDING} />,
      },
      {
        route: 'instances-profiles',
        label: renderMenuItemLabel(RECORD_TYPES_MAPPING[CAPABILITIES.INSTANCE]),
        component: () => <ProfilesContainer entityType={CAPABILITIES.INSTANCE} />,
      },
      {
        route: 'items-profiles',
        label: renderMenuItemLabel(RECORD_TYPES_MAPPING[CAPABILITIES.ITEM]),
        component: () => <ProfilesContainer entityType={CAPABILITIES.ITEM} />,
      },
    ]
  }] : [];

  const otherProfilesSection = hasCsvViewPerms || hasInAppUsersEditPerms ? [{
    label: renderMenuGroupLabel(formatMessage({ id: 'ui-bulk-edit.settings.otherProfiles' })),
    pages: [
      {
        route: 'users-profiles',
        label: renderMenuItemLabel(RECORD_TYPES_MAPPING[CAPABILITIES.USER]),
        component: () => <ProfilesContainer entityType={CAPABILITIES.USER} />
      },
    ]
  }] : [];

  const sections = hasSettingsViewPerms ? [
    ...inventoryProfilesSection,
    ...otherProfilesSection
  ] : [];

  return (
    <CommandList commands={defaultKeyboardShortcuts}>
      <Settings
        {...props}
        navPaneWidth="15%"
        stripes={stripes}
        sections={sections}
        paneTitle={formatMessage({ id: 'ui-bulk-edit.settings.paneTitle' })}
      />
    </CommandList>
  );
};
