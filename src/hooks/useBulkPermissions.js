import { useStripes } from '@folio/stripes/core';

export const useBulkPermissions = () => {
  const stripes = useStripes();

  // CSV perms
  const hasCsvViewPerms = stripes.hasPerm('ui-bulk-edit.users.csv.view');
  const hasCsvEditPerms = stripes.hasPerm('ui-bulk-edit.users.csv.edit');

  // In-app perms
  const hasInAppViewPerms = stripes.hasPerm('ui-bulk-edit.inventory.view');
  const hasInAppEditPerms = stripes.hasPerm('ui-bulk-edit.inventory.edit');
  const hasInAppUsersEditPerms = stripes.hasPerm('ui-bulk-edit.users.edit');

  // Query perms
  const hasQueryPerms = stripes.hasPerm('ui-bulk-edit.query.execute');

  // Inventory
  const hasItemsPerms = stripes.hasPerm('ui-inventory.item.edit');
  const hasHoldingsPerms = stripes.hasPerm('ui-inventory.holdings.edit');
  const hasInstancePerms = stripes.hasPerm('ui-inventory.instance.edit');
  const hasInventoryInstanceViewPerms = stripes.hasPerm('ui-inventory.instance.view');

  // Quick marc

  const hasQuickMarcEditPerms = stripes.hasPerm('ui-quick-marc.quick-marc-editor.all');
  const hasQuickMarcViewPerms = stripes.hasPerm('ui-quick-marc.quick-marc-editor.view');

  // Users
  const hasUsersPerms = stripes.hasPerm('ui-users.edit');
  const hasUsersViewPerms = stripes.hasPerm('ui-users.view');

  // derived pages
  const hasAnyInAppEditPermissions = hasInAppEditPerms || hasInAppUsersEditPerms;
  const hasOnlyViewCsvPerms = hasCsvViewPerms && !hasCsvEditPerms && !hasInAppUsersEditPerms;
  const hasViewInAppPerms = hasInAppViewPerms && !hasInAppEditPerms && !hasInAppUsersEditPerms;
  const isUserRadioDisabled = !hasCsvViewPerms && !hasInAppUsersEditPerms;
  const hasOnlyInAppViewPerms = hasInAppViewPerms && !hasCsvEditPerms && !hasInAppEditPerms && !hasInAppUsersEditPerms;
  const hasItemInventoryView = hasInAppViewPerms && hasItemsPerms;
  const hasHoldingsInventoryView = hasInAppViewPerms && hasHoldingsPerms;
  const hasInstanceInventoryView = hasInAppViewPerms && hasInstancePerms;
  const hasItemsAndHoldingsInventoryView = hasInAppViewPerms && hasInventoryInstanceViewPerms;
  const hasItemInventoryEdit = hasInAppEditPerms && hasItemsPerms;
  const hasHoldingsInventoryEdit = hasInAppEditPerms && hasHoldingsPerms;
  const hasAnyInventoryWithInAppView = (hasItemInventoryView || hasHoldingsInventoryView
      || hasItemsAndHoldingsInventoryView || hasInstanceInventoryView) && hasInAppViewPerms;
  const hasAnyUserWithBulkPerm = (hasUsersViewPerms || hasUsersPerms) &&
      (hasCsvViewPerms || hasCsvEditPerms || hasInAppUsersEditPerms);
  const isActionMenuShown = hasAnyInventoryWithInAppView || hasAnyUserWithBulkPerm;
  const hasInstanceAndMarcEditPerm = hasInstancePerms && hasQuickMarcEditPerms && hasInAppEditPerms;
  const hasInventoryAndMarcEditPerm = hasInventoryInstanceViewPerms && hasQuickMarcEditPerms && hasInAppEditPerms;
  const hasInstanceInventoryEdit = hasInAppEditPerms && hasInstancePerms;
  const hasOnlyViewInventoryAndMarcPerms = hasInventoryInstanceViewPerms && hasQuickMarcViewPerms;
  const hasUserEditLocalPerm = hasCsvEditPerms && hasUsersPerms;
  const hasUserEditInAppPerm = hasInAppUsersEditPerms && hasUsersPerms;
  const hasAnyEditPermissions = hasAnyUserWithBulkPerm || hasAnyInventoryWithInAppView;
  const isSelectIdentifiersDisabled = !hasAnyEditPermissions;
  const isDropZoneDisabled = !hasAnyEditPermissions;

  // Logs perms
  const hasLogViewPerms = stripes.hasPerm('ui-bulk-edit.logs.view');
  const hasLogItemViewPerms = hasLogViewPerms && hasItemsPerms;
  const hasLogHoldingsViewPerms = hasLogViewPerms && hasHoldingsPerms;
  const hasLogInstanceViewPerms = hasLogViewPerms && hasInstancePerms;
  const hasLogUsersPerms = (hasUsersPerms || hasUsersViewPerms) && hasLogViewPerms;

  // Settings perms
  const hasSettingsViewPerms = stripes.hasPerm('ui-bulk-edit.settings.view');
  const hasSettingsEditPerms = stripes.hasPerm('ui-bulk-edit.settings.edit');

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
    hasInstancePerms,
    hasSettingsViewPerms,
    hasSettingsEditPerms,

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
    hasLogUsersPerms,
    hasAnyUserWithBulkPerm,
    hasUserEditLocalPerm,
    hasUserEditInAppPerm,
    hasLogInstanceViewPerms,
    hasInstanceInventoryEdit,
    hasInstanceInventoryView,
    hasInstanceAndMarcEditPerm,
    hasInventoryAndMarcEditPerm,
    hasOnlyViewInventoryAndMarcPerms
  };
};
