import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react-hooks';
import { useSearchParams } from './useSearchParams';
import { useManualApproach } from './useManualApproach';
import { APPROACHES } from '../constants';

jest.mock('./useSearchParams', () => ({
  useSearchParams: jest.fn(),
}));

describe('useManualApproach', () => {
  let setParamMock;

  beforeEach(() => {
    setParamMock = jest.fn();
    useSearchParams.mockReturnValue({ setParam: setParamMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with default values', () => {
    const { result } = renderHook(() => useManualApproach());

    expect(result.current.isBulkEditModalOpen).toBe(false);
  });

  test('should open manual modal and set param', () => {
    const { result } = renderHook(() => useManualApproach());

    act(() => {
      result.current.openManualModal();
    });

    expect(result.current.isBulkEditModalOpen).toBe(true);
    expect(setParamMock).toHaveBeenCalledWith('approach', APPROACHES.MANUAL);
  });

  test('should close manual modal and set param', () => {
    const { result } = renderHook(() => useManualApproach());

    act(() => {
      result.current.closeManualModal();
    });

    expect(result.current.isBulkEditModalOpen).toBe(false);
    expect(setParamMock).toHaveBeenCalledWith('approach', null);
  });
});
