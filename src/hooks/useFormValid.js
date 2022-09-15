import { ACTIONS } from '../constants';

export const useFormValid = (contentUpdates) => {
  const isInAppFormValid = contentUpdates?.every(({ actions, action, option, value }) => {
    // USERS inApp approach
    if (actions) {
      return actions.every(act => !!act.value);
    }

    // ITEMS inApp approach
    if (action === ACTIONS.CLEAR) { // for clear field 'value' is not required
      return action && option;
    }

    return action && option && value;
  });

  return {
    isInAppFormValid,
  };
};
