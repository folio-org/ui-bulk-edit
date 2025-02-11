import { renderHook, act } from '@testing-library/react-hooks';
import { useErrorType } from './useErrorType';
import { ERROR_TYPES } from '../constants';

describe('useErrorType hook', () => {
  test('should return null errorType when there are no errors or warnings', () => {
    const { result } = renderHook(() => useErrorType({ countOfErrors: 0, countOfWarnings: 0 }));

    expect(result.current.errorType).toBeNull();
    expect(result.current.hasErrorsOrWarnings).toBe(false);
    expect(result.current.hasOnlyWarnings).toBe(false);
  });

  test('should return ERROR_TYPES.ERROR when errors exist', () => {
    const { result } = renderHook(() => useErrorType({ countOfErrors: 3, countOfWarnings: 0 }));

    expect(result.current.errorType).toBe(ERROR_TYPES.ERROR);
    expect(result.current.hasErrorsOrWarnings).toBe(true);
    expect(result.current.hasOnlyWarnings).toBe(false);
  });

  test('should return ERROR_TYPES.ERROR when errors and warnings exist', () => {
    const { result } = renderHook(() => useErrorType({ countOfErrors: 3, countOfWarnings: 3 }));

    expect(result.current.errorType).toBe(ERROR_TYPES.ERROR);
    expect(result.current.hasErrorsOrWarnings).toBe(true);
    expect(result.current.hasOnlyWarnings).toBe(false);
  });

  test('should return an empty string when only warnings exist', () => {
    const { result } = renderHook(() => useErrorType({ countOfErrors: 0, countOfWarnings: 2 }));

    expect(result.current.errorType).toBe('');
    expect(result.current.hasErrorsOrWarnings).toBe(true);
    expect(result.current.hasOnlyWarnings).toBe(true);
  });

  test('toggleShowWarnings should toggle between showing warnings and errors (errors scenario)', () => {
    const { result } = renderHook(() => useErrorType({ countOfErrors: 2, countOfWarnings: 0 }));

    expect(result.current.errorType).toBe(ERROR_TYPES.ERROR);

    act(() => {
      result.current.toggleShowWarnings();
    });
    expect(result.current.errorType).toBe('');

    act(() => {
      result.current.toggleShowWarnings();
    });
    expect(result.current.errorType).toBe(ERROR_TYPES.ERROR);
  });

  test('toggleShowWarnings should toggle correctly when only warnings exist', () => {
    const { result } = renderHook(() => useErrorType({ countOfErrors: 0, countOfWarnings: 3 }));

    expect(result.current.errorType).toBe('');

    act(() => {
      result.current.toggleShowWarnings();
    });
    expect(result.current.errorType).toBe(ERROR_TYPES.ERROR);
  });

  test('should update state when counts change', () => {
    const { result, rerender } = renderHook(
      ({ errors, warnings }) => useErrorType({ countOfErrors: errors, countOfWarnings: warnings }),
      {
        initialProps: { errors: 1, warnings: 0 },
      }
    );

    expect(result.current.errorType).toBe(ERROR_TYPES.ERROR);
    expect(result.current.hasErrorsOrWarnings).toBe(true);

    rerender({ errors: 0, warnings: 4 });
    expect(result.current.errorType).toBe('');
    expect(result.current.hasOnlyWarnings).toBe(true);

    rerender({ errors: 0, warnings: 0 });
    expect(result.current.errorType).toBeNull();
    expect(result.current.hasErrorsOrWarnings).toBe(false);
  });
});
