import { renderHook, act } from '@testing-library/react-hooks';
import { usePagination } from './usePagination';

describe('usePagination', () => {
  test('initial state is set correctly', () => {
    const { result } = renderHook(() => usePagination({ limit: 10, offset: 0 }));

    expect(result.current.pagination).toEqual({ limit: 10, offset: 0 });
  });

  test('changePage updates pagination correctly', () => {
    const { result } = renderHook(() => usePagination({ limit: 10, offset: 0 }));

    act(() => {
      result.current.changePage({ offset: 10 });
    });

    expect(result.current.pagination).toEqual({ limit: 10, offset: 10 });
  });

  test('changePage does not modify other properties', () => {
    const { result } = renderHook(() => usePagination({ limit: 10, offset: 0 }));

    act(() => {
      result.current.changePage({ offset: 10 });
    });

    expect(result.current.pagination.limit).toBe(10);
  });

  test('changePage works with multiple properties', () => {
    const { result } = renderHook(() => usePagination({ limit: 10, offset: 0 }));

    act(() => {
      result.current.changePage({ offset: 10, limit: 20 });
    });

    expect(result.current.pagination).toEqual({ limit: 20, offset: 10 });
  });
});
