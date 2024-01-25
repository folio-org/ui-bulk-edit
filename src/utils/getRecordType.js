import { CAPABILITIES, RECORD_TYPES } from '../constants';

export const getRecordType = (capability) => {
  if (Object.prototype.hasOwnProperty.call(CAPABILITIES, capability)) {
    return RECORD_TYPES[CAPABILITIES[capability]];
  } else {
    return null;
  }
};
