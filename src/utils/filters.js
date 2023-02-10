import {
  CAPABILITIES,
  CRITERIA,
  EDIT_CAPABILITIES_OPTIONS,
} from '../constants';

export const isCapabilityDisabled = (capabilityValue, view, perms = {}) => {
  const isQuery = view === CRITERIA.QUERY;

  const {
    isUserRadioDisabled,
    isInventoryRadioDisabled,
    hasItemsPerms,
    hasHoldingsPerms,
    hasUsersPerms,
  } = perms;

  const capabilitiesMap = {
    [CAPABILITIES.USER]: isQuery ? !hasUsersPerms : isUserRadioDisabled,
    [CAPABILITIES.ITEM]: isQuery ? !hasItemsPerms : isInventoryRadioDisabled,
    [CAPABILITIES.HOLDING]: isQuery ? !hasHoldingsPerms : isInventoryRadioDisabled,
  };

  return capabilitiesMap[capabilityValue];
};

export const getCapabilityOptions = (view, perms) => EDIT_CAPABILITIES_OPTIONS.map(capability => ({
  ...capability,
  disabled: isCapabilityDisabled(capability.value, view, perms),
}));

export const getDefaultCapabilities = (view, perms) => {
  const capabilityOptions = getCapabilityOptions(view, perms);

  return capabilityOptions.find(option => !option.disabled)?.value;
};
