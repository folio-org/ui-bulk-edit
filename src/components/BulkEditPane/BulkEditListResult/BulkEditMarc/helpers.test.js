import { FormattedMessage } from 'react-intl';

import { DATA_KEYS, getDataTemplate, getFieldWithMaxColumns, getNextDataControls } from './helpers';
import { ACTIONS } from '../../../../constants/marcActions';

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

describe('getNextDataControls', () => {
  const defaultTemplate = getDataTemplate();
  const appendTemplate = getDataTemplate({
    key: DATA_KEYS.SUBFIELD,
    title: <FormattedMessage id="ui-bulk-edit.layer.column.subfield" />,
  });

  test('should return correct template for ACTIONS.ADD_TO_EXISTING', () => {
    const result = getNextDataControls(ACTIONS.ADD_TO_EXISTING);
    expect(result).toEqual([defaultTemplate]);
  });

  test('should return correct template for ACTIONS.FIND', () => {
    const result = getNextDataControls(ACTIONS.FIND);
    expect(result).toEqual([defaultTemplate]);
  });

  test('should return correct template for ACTIONS.REPLACE_WITH', () => {
    const result = getNextDataControls(ACTIONS.REPLACE_WITH);
    expect(result).toEqual([defaultTemplate]);
  });

  test('should return correct templates for ACTIONS.APPEND', () => {
    const result = getNextDataControls(ACTIONS.APPEND);
    expect(result).toEqual([appendTemplate, defaultTemplate]);
  });

  test('should return empty array for ACTIONS.REMOVE_ALL', () => {
    const result = getNextDataControls(ACTIONS.REMOVE_ALL);
    expect(result).toEqual([]);
  });

  test('should return empty array for unknown action', () => {
    const result = getNextDataControls('UNKNOWN_ACTION');
    expect(result).toEqual([]);
  });
});
