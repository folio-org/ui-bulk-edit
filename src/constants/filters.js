import { CAPABILITIES } from './core';

export const getDefaultCapabilities = (perms, capabilities) => {
  const { hasInAppViewPerms, hasCsvViewPerms } = perms;

  if (hasInAppViewPerms && !hasCsvViewPerms) {
    return capabilities || CAPABILITIES.ITEM;
  }

  return capabilities || CAPABILITIES.USER;
};

