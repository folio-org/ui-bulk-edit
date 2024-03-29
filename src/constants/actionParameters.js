import { CAPABILITIES, OPTIONS, PARAMETERS_KEYS } from './index';

export const getActionParameters = (option, capability) => {
  if (option === OPTIONS.SUPPRESS_FROM_DISCOVERY) {
    if (capability === CAPABILITIES.HOLDING) {
      return [
        {
          key: PARAMETERS_KEYS.APPLY_TO_ITEMS,
          value: false,
        },
      ];
    }

    if (capability === CAPABILITIES.INSTANCE) {
      return [
        {
          key: PARAMETERS_KEYS.APPLY_TO_HOLDINGS,
          value: false,
        },
        {
          key: PARAMETERS_KEYS.APPLY_TO_ITEMS,
          value: false,
        },
      ];
    }
  }

  return [];
};
