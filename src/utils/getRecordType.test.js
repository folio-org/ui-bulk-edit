import { getRecordType } from './getRecordType';
import { CAPABILITIES, RECORD_TYPES } from '../constants';

describe('getRecordType', () => {
  it('should return the correct record type for a valid capability', () => {
    // Test each capability
    Object.keys(CAPABILITIES).forEach((capability) => {
      const result = getRecordType(capability);
      expect(result).toEqual(RECORD_TYPES[CAPABILITIES[capability]]);
    });
  });

  it('should return null for an invalid capability', () => {
    const invalidCapability = 'INVALID_CAPABILITY';
    const result = getRecordType(invalidCapability);
    expect(result).toBeNull();
  });
});
