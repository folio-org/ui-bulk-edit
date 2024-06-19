import { getMarkFormErrors } from './validation';

describe('isMarkFormValid', () => {
  test('should return true if all fields are valid and value is within the range', () => {
    const fields = [
      { name: 'field1', value: '550', other: 'data' },
      { name: 'field2', value: '950', other: 'data' },
    ];
    expect(getMarkFormErrors(fields)).toBe(true);
  });

  test('should return false if any field is invalid', () => {
    const fields = [
      { name: 'field1', value: '550', other: 'data' },
      { name: 'field2', value: '600', other: 'data' },
    ];
    expect(getMarkFormErrors(fields)).toBe(false);
  });

  test('should return false if any field is missing or falsey', () => {
    const fields = [
      { name: 'field1', value: '550', other: 'data' },
      { name: 'field2', value: '401', other: 'data' },
    ];
    expect(getMarkFormErrors(fields)).toBe(false);
  });
});
