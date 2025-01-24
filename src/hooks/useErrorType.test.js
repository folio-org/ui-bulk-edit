import { renderHook, act } from '@testing-library/react-hooks';
import { useErrorType } from './useErrorType';
import { ERROR_TYPES } from '../constants';

describe('useErrorType', () => {
  it('should initialize with no error type if only warnings exist', () => {
    const { result } = renderHook(() => useErrorType({ countOfErrors: 0, countOfWarnings: 1 }));
    expect(result.current.errorType).toBe('');
  });

  it('should initialize with error type if errors exist', () => {
    const { result } = renderHook(() => useErrorType({ countOfErrors: 1, countOfWarnings: 0 }));
    expect(result.current.errorType).toBe(ERROR_TYPES.ERROR);
  });

  it('should toggle error type when toggleErrorType is called', () => {
    const { result } = renderHook(() => useErrorType({ countOfErrors: 1, countOfWarnings: 0 }));

    expect(result.current.errorType).toBe(ERROR_TYPES.ERROR);

    act(() => {
      result.current.toggleErrorType();
    });
    expect(result.current.errorType).toBe('');

    act(() => {
      result.current.toggleErrorType();
    });
    expect(result.current.errorType).toBe(ERROR_TYPES.ERROR);
  });

  it('should reset error type when the input props change', () => {
    const { result, rerender } = renderHook(
      ({ countOfErrors, countOfWarnings }) => useErrorType({ countOfErrors, countOfWarnings }),
      {
        initialProps: { countOfErrors: 1, countOfWarnings: 0 },
      }
    );

    expect(result.current.errorType).toBe(ERROR_TYPES.ERROR);

    rerender({ countOfErrors: 0, countOfWarnings: 1 });
    expect(result.current.errorType).toBe('');

    rerender({ countOfErrors: 2, countOfWarnings: 0 });
    expect(result.current.errorType).toBe(ERROR_TYPES.ERROR);
  });
});
