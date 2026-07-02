import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react-hooks';
import { useSearchParams } from './useSearchParams';
import { useDeleteApproach } from './useDeleteApproach';
import { APPROACHES } from '../constants';

jest.mock('./useSearchParams', () => ({
  useSearchParams: jest.fn(),
}));

describe('useDeleteApproach', () => {
  let setParamMock;

  beforeEach(() => {
    setParamMock = jest.fn();
    useSearchParams.mockReturnValue({ setParam: setParamMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with default values', () => {
    const { result } = renderHook(() => useDeleteApproach());

    expect(result.current.isDeleteModalOpen).toBe(false);
  });

  test('should open delete modal and set param', () => {
    const { result } = renderHook(() => useDeleteApproach());

    act(() => {
      result.current.openDeleteModal();
    });

    expect(result.current.isDeleteModalOpen).toBe(true);
    expect(setParamMock).toHaveBeenCalledWith('approach', APPROACHES.DELETE);
  });

  test('should close delete modal and set param', () => {
    const { result } = renderHook(() => useDeleteApproach());

    act(() => {
      result.current.closeDeleteModal();
    });

    expect(result.current.isDeleteModalOpen).toBe(false);
    expect(setParamMock).toHaveBeenCalledWith('approach', null);
  });
});

