import {
  CAPABILITIES,
  CRITERIA,
  EDIT_CAPABILITIES_OPTIONS,
} from '../constants';

export const isCapabilityDisabled = (capabilityValue, view, perms = {}) => {
  const isQuery = view === CRITERIA.QUERY;

  const {
    isUserRadioDisabled,
    hasItemInventoryView,
    hasHoldingsInventoryView,
    hasItemsAndHoldingsInventoryView,
    hasUsersPerms,
  } = perms;

  const capabilitiesMap = {
    [CAPABILITIES.USER]: isQuery ? !hasUsersPerms : isUserRadioDisabled,
    [CAPABILITIES.ITEM]: (!hasItemInventoryView || !hasItemsAndHoldingsInventoryView),
    [CAPABILITIES.HOLDING]: (!hasHoldingsInventoryView || !hasItemsAndHoldingsInventoryView),
  };

  return capabilitiesMap[capabilityValue];
};

export const getCapabilityOptions = (view, perms) => EDIT_CAPABILITIES_OPTIONS.map(capability => ({
  ...capability,
  hidden: isCapabilityDisabled(capability.value, view, perms),
}));

export const getDefaultCapabilities = (view, perms) => {
  const capabilityOptions = getCapabilityOptions(view, perms);

  console.log(capabilityOptions);

  return capabilityOptions.find(option => !option.hidden)?.value;
};

export const groupByCategory = (array) => {
  return array.reduce((acc, item) => {
    if (item.categoryName) {
      if (!acc[item.categoryName]) {
        acc[item.categoryName] = [];
      }

      acc[item.categoryName].push(item);
    } else {
      acc[item.label] = item;
    }

    return acc;
  }, {});
};


