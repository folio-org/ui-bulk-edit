import { DATA_KEYS, getFieldWithMaxColumns } from './helpers';

describe('getFieldWithMaxColumns', () => {
  test('should return the field with the maximum columns', () => {
    const fields = [
      {
        actions: [
          { data: [{ key: DATA_KEYS.SUBFIELD, value: 'value1' }] },
          { data: [{ key: DATA_KEYS.VALUE, value: 'value2' }, { key: 'key3', value: 'value3' }] },
        ],
      },
      {
        actions: [
          { data: [{ key: DATA_KEYS.VALUE, value: 'value4' }] },
        ],
      },
      {
        actions: [
          { data: [{ key: DATA_KEYS.SUBFIELD, value: 'value5' }, { key: DATA_KEYS.VALUE, value: 'value6' }] },
        ],
      },
    ];

    const maxField = getFieldWithMaxColumns(fields);
    expect(maxField).toEqual(fields[0]);
  });

  test('should handle a single field in the array', () => {
    const fields = [
      {
        actions: [
          { data: [{ key: DATA_KEYS.VALUE, value: 'value1' }] },
        ],
      },
    ];

    const maxField = getFieldWithMaxColumns(fields);
    expect(maxField).toEqual(fields[0]);
  });

  test('should handle fields with no actions', () => {
    const fields = [
      { actions: [] },
      { actions: [] },
    ];

    const maxField = getFieldWithMaxColumns(fields);
    expect(maxField).toEqual(fields[0]);
  });

  test('should handle fields with null actions', () => {
    const fields = [
      { actions: [null] },
      { actions: [null, { data: [{ key: DATA_KEYS.VALUE, value: 'value1' }] }] },
    ];

    const maxField = getFieldWithMaxColumns(fields);
    expect(maxField).toEqual(fields[1]);
  });

  test('should handle fields with mixed valid and null actions and data', () => {
    const fields = [
      {
        actions: [
          { data: [{ key: DATA_KEYS.SUBFIELD, value: 'value1' }] },
          { data: [null, { key: DATA_KEYS.VALUE, value: 'value2' }] },
          null,
        ],
      },
      {
        actions: [
          null,
          { data: [null, { key: DATA_KEYS.VALUE, value: 'value3' }] },
        ],
      },
    ];

    const maxField = getFieldWithMaxColumns(fields);
    expect(maxField).toEqual(fields[0]);
  });
});
