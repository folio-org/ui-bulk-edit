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

  // Query perms
  const hasQueryPerms = stripes.hasPerm('ui-bulk-edit.query');

  // Inventory
  const hasInventoryItemPerms = stripes.hasPerm('ui-inventory.item.edit');
  const hasInventoryHoldingsPerms = stripes.hasPerm('ui-inventory.holdings.edit');

  // Users
  const hasUsersEditPerms = stripes.hasPerm('ui-users.edit');

  // derived pages
  const hasAnyEditPermissions = hasCsvEditPerms || hasInAppEditPerms || hasInAppUsersEditPerms;
  const isActionMenuShown = hasCsvEditPerms;
  const isSelectIdentifiersDisabled = !hasAnyEditPermissions;
  const isDropZoneDisabled = !hasAnyEditPermissions;
  const isInventoryRadioDisabled = !hasInAppViewPerms;
  const isUserRadioDisabled = !hasCsvViewPerms && !hasInAppUsersEditPerms;
  const hasOnlyInAppViewPerms = hasInAppViewPerms && !hasCsvEditPerms && !hasInAppEditPerms && !hasInAppUsersEditPerms;
  const hasQueryAndItemsPerms = hasQueryPerms && hasInventoryItemPerms;
  const hasQueryAndHoldingsPerms = hasQueryPerms && hasInventoryHoldingsPerms;
  const hasQueryAndUsersPerms = hasQueryPerms && hasUsersEditPerms;

  // Logs perms
  const hasLogViewPerms = stripes.hasPerm('ui-bulk-edit.logs.view');

  return {
    // base
    hasCsvViewPerms,
    hasCsvEditPerms,
    hasInAppViewPerms,
    hasInAppEditPerms,
    hasInAppUsersEditPerms,
    hasLogViewPerms,
    hasQueryPerms,

    // derived
    isActionMenuShown,
    isSelectIdentifiersDisabled,
    isDropZoneDisabled,
    isInventoryRadioDisabled,
    isUserRadioDisabled,
    hasOnlyInAppViewPerms,
    hasAnyEditPermissions,
    hasQueryAndItemsPerms,
    hasQueryAndHoldingsPerms,
    hasQueryAndUsersPerms,
  };
};
