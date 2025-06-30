import { act, renderHook } from '@testing-library/react-hooks';

import { useSearchParams } from './useSearchParams';
import { useInAppApproach } from './useInAppApproach';
import { APPROACHES } from '../constants';


jest.mock('./useSearchParams', () => ({
  useSearchParams: jest.fn(),
}));

describe('useInAppApproach', () => {
  let setParamMock;

  beforeEach(() => {
    setParamMock = jest.fn();
    useSearchParams.mockReturnValue({ setParam: setParamMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize with default values', () => {
    const { result } = renderHook(() => useInAppApproach());

    expect(result.current.isInAppLayerOpen).toBe(false);
    expect(result.current.isPreviewModalOpened).toBe(false);
  });

  it('should open in-app layer and set param', () => {
    const { result } = renderHook(() => useInAppApproach());

    act(() => {
      result.current.openInAppLayer();
    });

    expect(result.current.isInAppLayerOpen).toBe(true);
    expect(setParamMock).toHaveBeenCalledWith('approach', APPROACHES.IN_APP);
  });

  it('should close in-app layer and set param', () => {
    const { result } = renderHook(() => useInAppApproach());

    act(() => {
      result.current.closeInAppLayer();
    });

    expect(result.current.isInAppLayerOpen).toBe(false);
    expect(setParamMock).toHaveBeenCalledWith('approach', null);
  });

  it('should open preview modal', () => {
    const { result } = renderHook(() => useInAppApproach());

    act(() => {
      result.current.openInAppPreviewModal();
    });

    expect(result.current.isPreviewModalOpened).toBe(true);
  });

  it('should close preview modal', () => {
    const { result } = renderHook(() => useInAppApproach());

    act(() => {
      result.current.closeInAppPreviewModal();
    });

    expect(result.current.isPreviewModalOpened).toBe(false);
  });
});
