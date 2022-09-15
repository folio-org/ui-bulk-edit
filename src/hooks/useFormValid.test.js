import { renderHook } from '@testing-library/react-hooks';
import { useFormValid } from './useFormValid';
import { ACTIONS, OPTIONS } from '../constants';

const validItemContentUpdates = [
  {
    option: OPTIONS.PERMANENT_LOCATION,
    action: ACTIONS.REPLACE,
    value: 'some value',
  },
];

const invalidItemContentUpdates = [
  {
    option: OPTIONS.PERMANENT_LOCATION,
    action: '',
    value: '',
  },
];

const validItemWithClearContentUpdates = [
  {
    option: OPTIONS.PERMANENT_LOCATION,
    action: ACTIONS.CLEAR,
    value: '',
  },
];

const validUserContentUpdates = [
  {
    option: OPTIONS.PERMANENT_LOCATION,
    actions: [
      {
        name: ACTIONS.FIND,
        value: 'find value',
      },
      {
        name: ACTIONS.REPLACE,
        value: 'replace value',
      },
    ],
  },
];

const invalidUserContentUpdates = [
  {
    option: OPTIONS.PERMANENT_LOCATION,
    actions: [
      {
        name: ACTIONS.FIND,
        value: '',
      },
      {
        name: ACTIONS.REPLACE,
        value: '',
      },
    ],
  },
];

describe('useFormValid hook', () => {
  // ITEM InApp approach
  test('should be valid ITEM approach', () => {
    const { result } = renderHook(() => useFormValid(validItemContentUpdates));

    expect(result.current.isInAppFormValid).toBeTruthy();
  });

  test('should be NOT valid ITEM approach ', () => {
    const { result } = renderHook(() => useFormValid(invalidItemContentUpdates));

    expect(result.current.isInAppFormValid).not.toBeTruthy();
  });

  test('should be valid if CLEAR_FIELD without value ', () => {
    const { result } = renderHook(() => useFormValid(validItemWithClearContentUpdates));

    expect(result.current.isInAppFormValid).toBeTruthy();
  });

  // USER InApp approach
  test('should be valid USER approach', () => {
    const { result } = renderHook(() => useFormValid(validUserContentUpdates));

    expect(result.current.isInAppFormValid).toBeTruthy();
  });

  test('should be NOT valid USER approach', () => {
    const { result } = renderHook(() => useFormValid(invalidUserContentUpdates));

    expect(result.current.isInAppFormValid).not.toBeTruthy();
  });
});
