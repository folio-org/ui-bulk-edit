import { CAPABILITIES, RECORD_TYPES } from '../constants';

export const getRecordType = (capability) => {
  if (Object.hasOwn(CAPABILITIES, capability)) {
    return RECORD_TYPES[CAPABILITIES[capability]];
  } else {
    return null;
  }
};
