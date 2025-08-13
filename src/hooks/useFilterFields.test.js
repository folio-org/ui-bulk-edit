import { render, cleanup } from '@folio/jest-config-stripes/testing-library/react';

import { getActionIndex } from '../components/BulkEditPane/BulkEditListResult/BulkEditInApp/helpers';
import { OPTIONS } from '../constants';
import { useFilterFields } from './useFilterFields';

jest.mock('../components/BulkEditPane/BulkEditListResult/BulkEditInApp/helpers', () => ({
  getActionIndex: jest.fn(),
}));

jest.mock('../constants', () => ({
  ACTIONS: { SET_TO_TRUE: 'SET_TO_TRUE' },
  OPTIONS: {
    SET_RECORDS_FOR_DELETE: 'SET_RECORDS_FOR_DELETE',
    STAFF_SUPPRESS: 'STAFF_SUPPRESS',
    SUPPRESS_FROM_DISCOVERY: 'SUPPRESS_FROM_DISCOVERY',
    OTHER_OPTION: 'OTHER_OPTION',
  },
}));

afterEach(() => {
  cleanup();
  jest.clearAllMocks();
});

function HookHarness({ fields, setFields }) {
  useFilterFields(fields, setFields);
  return null;
}

describe('useFilterFields', () => {
  const sampleFields = [
    { option: OPTIONS.STAFF_SUPPRESS, label: 'Staff suppress' },
    { option: OPTIONS.SUPPRESS_FROM_DISCOVERY, label: 'Suppress from discovery' },
    { option: OPTIONS.OTHER_OPTION, label: 'Other' },
  ];

  test('filters out STAFF_SUPPRESS and SUPPRESS_FROM_DISCOVERY when SET_TO_TRUE for SET_RECORDS_FOR_DELETE is present', () => {
    getActionIndex.mockReturnValue(0); // action is present
    const setFields = jest.fn();

    render(<HookHarness fields={sampleFields} setFields={setFields} />);

    expect(setFields).toHaveBeenCalledTimes(1);
    const updater = setFields.mock.calls[0][0];
    expect(typeof updater).toBe('function');

    const result = updater(sampleFields);
    expect(result).toEqual([{ option: OPTIONS.OTHER_OPTION, label: 'Other' }]);
  });

  test('does nothing when the target action is not present', () => {
    getActionIndex.mockReturnValue(-1); // action is absent
    const setFields = jest.fn();

    render(<HookHarness fields={sampleFields} setFields={setFields} />);

    expect(setFields).not.toHaveBeenCalled();
  });

  test('runs effect only after the action becomes present on a subsequent render', () => {
    // first render: not present, second render: present
    getActionIndex
      .mockReturnValueOnce(-1)
      .mockReturnValueOnce(1);

    const setFields = jest.fn();

    const { rerender } = render(<HookHarness fields={sampleFields} setFields={setFields} />);
    expect(setFields).not.toHaveBeenCalled();

    rerender(<HookHarness fields={sampleFields} setFields={setFields} />);
    expect(setFields).toHaveBeenCalledTimes(1);

    const updater = setFields.mock.calls[0][0];
    const result = updater(sampleFields);
    expect(result.map(f => f.option)).toEqual([OPTIONS.OTHER_OPTION]);
  });

  test('does not remove unrelated options when filtering', () => {
    getActionIndex.mockReturnValue(2);
    const setFields = jest.fn();

    const fields = [
      ...sampleFields,
      { option: 'ANOTHER', label: 'Another' },
    ];

    render(<HookHarness fields={fields} setFields={setFields} />);

    const updater = setFields.mock.calls[0][0];
    const result = updater(fields);

    expect(result).toEqual([
      { option: OPTIONS.OTHER_OPTION, label: 'Other' },
      { option: 'ANOTHER', label: 'Another' },
    ]);
  });
});
