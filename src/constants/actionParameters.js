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

  const showForSpecificItemNotes = [OPTIONS.ITEM_NOTE, OPTIONS.CHECK_IN_NOTE, OPTIONS.CHECK_OUT_NOTE].includes(option)
    && capability === CAPABILITIES.ITEM;
  const showForSpecificHoldingNotes = option === OPTIONS.HOLDINGS_NOTE && capability === CAPABILITIES.HOLDING;
  const showForSpecificInstanceNotes = option === OPTIONS.INSTANCE_NOTE && capability === CAPABILITIES.INSTANCE;

  if (showForSpecificItemNotes || showForSpecificHoldingNotes || showForSpecificInstanceNotes) {
    return [
      {
        key: PARAMETERS_KEYS.STAFF_ONLY,
        value: false,
        onlyForActions: [ACTIONS.ADD_TO_EXISTING]
      }
    ];
  }

  return [];
};
