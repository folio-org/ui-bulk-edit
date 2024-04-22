import { ACTIONS, CAPABILITIES, OPTIONS, PARAMETERS_KEYS } from './index';

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

  if ([OPTIONS.ITEM_NOTE, OPTIONS.HOLDINGS_NOTE].includes(option)) {
    if ([CAPABILITIES.ITEM, CAPABILITIES.HOLDING].includes(capability)) {
      return [
        {
          key: PARAMETERS_KEYS.STAFF_ONLY,
          value: false,
          onlyForActions: [ACTIONS.ADD_TO_EXISTING]
        },
      ];
    }
  }


  return [];
};
