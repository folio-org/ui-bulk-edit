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
  const hasItemsPerms = stripes.hasPerm('ui-inventory.item.edit');
  const hasHoldingsPerms = stripes.hasPerm('ui-inventory.holdings.edit');
  const hasInventoryInstanceViewPerms = stripes.hasPerm('ui-inventory.instance.view');

  // Users
  const hasUsersPerms = stripes.hasPerm('ui-users.edit');
  const hasUsersViewPerms = stripes.hasPerm('ui-users.view');

  // derived pages
  const hasAnyInAppEditPermissions = hasInAppEditPerms || hasInAppUsersEditPerms;
  const hasAnyEditPermissions = hasCsvEditPerms || hasAnyInAppEditPermissions;
  const hasOnlyViewCsvPerms = hasCsvViewPerms && !hasCsvEditPerms && !hasInAppUsersEditPerms;
  const hasViewInAppPerms = hasInAppViewPerms && !hasInAppEditPerms && !hasInAppUsersEditPerms;
  const isActionMenuShown = hasCsvEditPerms || hasAnyInAppEditPermissions;
  const isSelectIdentifiersDisabled = !hasAnyEditPermissions;
  const isDropZoneDisabled = !hasAnyEditPermissions;
  const isUserRadioDisabled = !hasCsvViewPerms && !hasInAppUsersEditPerms;
  const hasOnlyInAppViewPerms = hasInAppViewPerms && !hasCsvEditPerms && !hasInAppEditPerms && !hasInAppUsersEditPerms;
  const hasItemInventoryView = hasInAppViewPerms && hasItemsPerms;
  const hasHoldingsInventoryView = hasInAppViewPerms && hasHoldingsPerms;
  const hasItemsAndHoldingsInventoryView = hasInAppViewPerms && hasInventoryInstanceViewPerms;
  const hasItemInventoryEdit = hasInAppEditPerms && hasItemsPerms;
  const hasHoldingsInventoryEdit = hasInAppEditPerms && hasHoldingsPerms;
  const hasAnyInventoryWithInAppView = (hasItemInventoryView || hasHoldingsInventoryView
      || hasItemsAndHoldingsInventoryView) && hasInAppViewPerms;

  // Logs perms
  const hasLogViewPerms = stripes.hasPerm('ui-bulk-edit.logs.view');
  const hasLogItemViewPerms = hasLogViewPerms && hasItemsPerms;
  const hasLogHoldingsViewPerms = hasLogViewPerms && hasHoldingsPerms;

  return {
    // base
    hasCsvViewPerms,
    hasCsvEditPerms,
    hasInAppViewPerms,
    hasInAppEditPerms,
    hasInAppUsersEditPerms,
    hasLogViewPerms,
    hasQueryPerms,
    hasInventoryInstanceViewPerms,

    // derived
    isActionMenuShown,
    isSelectIdentifiersDisabled,
    isDropZoneDisabled,
    isUserRadioDisabled,
    hasOnlyInAppViewPerms,
    hasAnyEditPermissions,
    hasAnyInAppEditPermissions,
    hasItemsPerms,
    hasHoldingsPerms,
    hasUsersPerms,
    hasUsersViewPerms,
    hasOnlyViewCsvPerms,
    hasViewInAppPerms,
    hasItemInventoryEdit,
    hasHoldingsInventoryEdit,
    hasItemInventoryView,
    hasHoldingsInventoryView,
    hasItemsAndHoldingsInventoryView,
    hasAnyInventoryWithInAppView,
    hasLogItemViewPerms,
    hasLogHoldingsViewPerms,
  };
};
