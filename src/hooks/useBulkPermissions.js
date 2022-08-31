import { useStripes } from '@folio/stripes/core';

export const useBulkPermissions = () => {
  const stripes = useStripes();

  // CSV perms
  const hasCsvViewPerms = stripes.hasPerm('ui-bulk-edit.view');
  const hasCsvEditPerms = stripes.hasPerm('ui-bulk-edit.edit');

  // In-app perms
  const hasInAppViewPerms = stripes.hasPerm('ui-bulk-edit.app-view');
  const hasInAppEditPerms = stripes.hasPerm('ui-bulk-edit.app-edit');
  const hasInAppUsersEditPerms = stripes.hasPerm('ui-bulk-edit.app-edit.users');

  // derived pages
  const hasAnyEditPermissions = hasCsvEditPerms || hasInAppEditPerms || hasInAppUsersEditPerms;
  const isActionMenuShown = hasCsvEditPerms;
  const isSelectIdentifiersDisabled = !hasAnyEditPermissions;
  const isDropZoneDisabled = !hasAnyEditPermissions;
  const isInventoryRadioDisabled = !hasInAppViewPerms;
  const isUserRadioDisabled = !hasCsvViewPerms && !hasInAppUsersEditPerms;
  const hasOnlyInAppViewPerms = hasInAppViewPerms && !hasCsvEditPerms;


  return {
    // base
    hasCsvViewPerms,
    hasCsvEditPerms,
    hasInAppViewPerms,
    hasInAppEditPerms,
    hasInAppUsersEditPerms,

    // derived
    isActionMenuShown,
    isSelectIdentifiersDisabled,
    isDropZoneDisabled,
    isInventoryRadioDisabled,
    isUserRadioDisabled,
    hasOnlyInAppViewPerms,
    hasAnyEditPermissions,
  };
};
