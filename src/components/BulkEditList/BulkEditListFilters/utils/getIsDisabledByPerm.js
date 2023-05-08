import { CAPABILITIES } from '../../../../constants';

export const getIsDisabledByPerm = (capabilities, defaultPerm, csvPerm, inAppView) => {
  switch (capabilities) {
    case CAPABILITIES.USER:
      if (csvPerm) {
        return true;
      } else return defaultPerm;
    case CAPABILITIES.ITEM:
    case CAPABILITIES.HOLDING:
      if (inAppView) {
        return true;
      } else return defaultPerm;

    default: return defaultPerm;
  }
};
