import { renderHook } from '@testing-library/react-hooks';
import { usePulling } from './usePulling';

const mockDataWithoutStop = {
  refetchingTimeout: 1000,
  dependencies: [],
  interval: 300,
  stopCondition: false,
};

const mockDataWithStop = {
  refetchingTimeout: 1000,
  dependencies: [],
  interval: 300,
  stopCondition: true,
};

describe('usePulling hook', () => {
  it('should be returned 300 by default', async () => {
    const { result } = renderHook(() => usePulling(mockDataWithoutStop));

    await expect(result.current.refetchInterval)
      .toBe(300);
  });

  it('should be returned 0 with stop condition', async () => {
    const { result } = renderHook(() => usePulling(mockDataWithStop));

    await expect(result.current.refetchInterval)
      .toBe(0);
  });
});
