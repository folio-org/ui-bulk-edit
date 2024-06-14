import { isMarcValueValid, isMarkFormValid } from './helpers';

describe('isMarcValueValid', () => {
  test('should return true for values between 500 and 599', () => {
    expect(isMarcValueValid('500')).toBe(true);
    expect(isMarcValueValid('599')).toBe(true);
  });

  test('should return true for values between 900 and 999', () => {
    expect(isMarcValueValid('900')).toBe(true);
    expect(isMarcValueValid('950')).toBe(true);
  });

  test('should return false for values outside the ranges', () => {
    expect(isMarcValueValid('499')).toBe(false);
    expect(isMarcValueValid('600')).toBe(false);
  });

  test('should return false for non-numeric values', () => {
    expect(isMarcValueValid('abc')).toBe(false);
    expect(isMarcValueValid('12a')).toBe(false);
    expect(isMarcValueValid('')).toBe(false);
  });
});

describe('isMarkFormValid', () => {
  test('should return true if all fields are valid and value is within the range', () => {
    const fields = [
      { name: 'field1', value: '550', other: 'data' },
      { name: 'field2', value: '950', other: 'data' },
    ];
    expect(isMarkFormValid(fields)).toBe(true);
  });

  test('should return false if any field is invalid', () => {
    const fields = [
      { name: 'field1', value: '550', other: 'data' },
      { name: 'field2', value: '600', other: 'data' },
    ];
    expect(isMarkFormValid(fields)).toBe(false);
  });

  test('should return false if any field is missing or falsey', () => {
    const fields = [
      { name: 'field1', value: '550', other: 'data' },
      { name: 'field2', value: '401', other: 'data' },
    ];
    expect(isMarkFormValid(fields)).toBe(false);
  });
});
