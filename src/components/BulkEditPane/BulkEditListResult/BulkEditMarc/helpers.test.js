import { DATA_KEYS, getFieldWithMaxColumns, injectMargins } from './helpers';

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


describe('injectMargins', () => {
  const baseField = (actions) => ({ tag: '100', actions });

  it('returns original fields when no SUBFIELD action present anywhere', () => {
    const fields = [
      baseField([{ name: 'A', data: [{ key: 'X', value: '1' }] }]),
      baseField([{ name: 'B', data: [{ key: 'Y', value: '2' }] }]),
    ];
    const result = injectMargins(fields);
    expect(result).toEqual(fields);
  });

  it('adds margin class to second action data of fields without SUBFIELD when one has it', () => {
    const withSub = baseField([
      { name: 'sub', data: [{ key: DATA_KEYS.SUBFIELD, value: 'a' }] },
      { name: 'other', data: [{ key: 'Z', value: '3' }] }
    ]);
    const withoutSub = baseField([
      { name: 'first', data: [{ key: 'X', value: '1' }] },
      { name: 'second', data: [{ key: 'Y', value: '2' }] }
    ]);

    const fields = [withSub, withoutSub];
    const result = injectMargins(fields);

    expect(result[0]).toEqual(withSub);

    expect(result[1].actions[1].data).toEqual(
      withoutSub.actions[1].data.map(d => ({ ...d, margin: true }))
    );
  });

  it('does not modify fields that already contain SUBFIELD action', () => {
    const fields = [
      baseField([
        { name: 'x', data: [{ key: DATA_KEYS.SUBFIELD, value: 'b' }] },
        { name: 'y', data: [{ key: 'Z', value: '3' }] }
      ])
    ];
    const result = injectMargins(fields);
    expect(result).toEqual(fields);
  });

  it('handles multiple fields with mixed presence', () => {
    const f1 = baseField([
      { name: 'a', data: [{ key: 'X', value: '1' }] },
      { name: 'b', data: [{ key: 'Y', value: '2' }] }
    ]);
    const f2 = baseField([
      { name: 'c', data: [{ key: DATA_KEYS.SUBFIELD, value: 'c' }] },
      { name: 'd', data: [{ key: 'W', value: '4' }] }
    ]);
    const f3 = baseField([
      { name: 'e', data: [{ key: 'P', value: '5' }] },
      { name: 'f', data: [{ key: 'Q', value: '6' }] }
    ]);

    const result = injectMargins([f1, f2, f3]);

    expect(result[1]).toEqual(f2);
    expect(result[0].actions[1].data.every(d => d.margin)).toBe(true);
    expect(result[2].actions[1].data.every(d => d.margin)).toBe(true);
  });
});
