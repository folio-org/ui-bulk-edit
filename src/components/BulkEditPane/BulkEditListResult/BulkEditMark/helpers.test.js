import { isMarkValueValid, isMarkFormValid } from './helpers';

describe('isMarcValueValid', () => {
  test('should return true for values between 500 and 599', () => {
    expect(isMarkValueValid('500')).toBe(true);
    expect(isMarkValueValid('599')).toBe(true);
  });

  test('should return true for values between 900 and 999', () => {
    expect(isMarkValueValid('900')).toBe(true);
    expect(isMarkValueValid('950')).toBe(true);
  });

  test('should return false for values outside the ranges', () => {
    expect(isMarkValueValid('499')).toBe(false);
    expect(isMarkValueValid('600')).toBe(false);
  });

  test('should return false for non-numeric values', () => {
    expect(isMarkValueValid('abc')).toBe(false);
    expect(isMarkValueValid('12a')).toBe(false);
    expect(isMarkValueValid('')).toBe(false);
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
