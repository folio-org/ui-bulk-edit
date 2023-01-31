import { CAPABILITIES, EDIT_CAPABILITIES_OPTIONS } from '../constants';

export const isCapabilityDisabled = (capabilityValue, perms = {}) => {
  const { isUserRadioDisabled, isInventoryRadioDisabled } = perms;

  const capabilitiesMap = {
    [CAPABILITIES.USER]: isUserRadioDisabled,
    [CAPABILITIES.ITEM]: isInventoryRadioDisabled,
    [CAPABILITIES.HOLDING]: isInventoryRadioDisabled,
  };

  return capabilitiesMap[capabilityValue];
};

export const getCapabilityOptions = (perms) => EDIT_CAPABILITIES_OPTIONS.map(capability => ({
  ...capability,
  disabled: isCapabilityDisabled(capability.value, perms),
}));

export const getDefaultCapabilities = (perms) => {
  const capabilityOptions = getCapabilityOptions(perms);

  return capabilityOptions.find(option => !option.disabled)?.value;
};
