import { renderHook } from '@testing-library/react-hooks';
import { useQuery } from 'react-query';

import { useNamespace, useOkapiKy } from '@folio/stripes/core';

import { useErrorMessages } from '../useErrorMessages';
import { useErrorsPreview, PREVIEW_ERRORS_KEY } from './useErrorsPreview';
import { ERROR_TYPES, PREVIEW_LIMITS } from '../../constants';

jest.mock('react-query', () => ({
  useQuery: jest.fn(),
}));

jest.mock('@folio/stripes/core', () => ({
  useNamespace: jest.fn(),
  useOkapiKy: jest.fn(),
}));

jest.mock('../useErrorMessages', () => ({
  useErrorMessages: jest.fn(),
}));

describe('useErrorsPreview', () => {
  const mockGet = jest.fn();
  const mockShowErrorMessage = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();

    useOkapiKy.mockReturnValue({ get: mockGet });
    useNamespace.mockReturnValue([PREVIEW_ERRORS_KEY]);
    useErrorMessages.mockReturnValue({ showErrorMessage: mockShowErrorMessage });
  });

  it('should return errors and isFetching from useQuery', () => {
    const mockData = { errors: ['error1', 'error2'] };

    useQuery.mockReturnValue({
      data: mockData,
      isFetching: true,
    });

    const { result } = renderHook(() => useErrorsPreview({
      id: '123',
      enabled: true,
      errorType: ERROR_TYPES.ERROR
    }));

    expect(result.current.errors).toEqual(['error1', 'error2']);
    expect(result.current.isFetching).toBe(true);

    expect(useNamespace).toHaveBeenCalledWith({ key: PREVIEW_ERRORS_KEY });
    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [PREVIEW_ERRORS_KEY, '123', PREVIEW_LIMITS.ERRORS, 0, ERROR_TYPES.ERROR],
        queryFn: expect.any(Function),
        enabled: true,
      })
    );
  });

  it('should call ky.get with the correct parameters in queryFn', async () => {
    mockGet.mockResolvedValue({ json: () => ({ errors: [] }) });
    useQuery.mockImplementation(({ queryFn }) => {
      queryFn();
      return { data: null, isFetching: false };
    });

    renderHook(() => useErrorsPreview({
      id: '123',
      enabled: true,
      offset: 10,
      limit: 20,
      errorType: ERROR_TYPES.WARNING
    }));

    expect(mockGet).toHaveBeenCalledWith('bulk-operations/123/errors', {
      searchParams: { limit: 20, offset: 10, errorType: ERROR_TYPES.WARNING },
    });
  });

  it('should handle onError and onSuccess callbacks', () => {
    useQuery.mockImplementation(({ onError, onSuccess }) => {
      onError();
      onSuccess();
      return { data: null, isFetching: false };
    });

    renderHook(() => useErrorsPreview({ id: '123', enabled: true }));

    expect(mockShowErrorMessage).toHaveBeenCalledTimes(2);
  });

  it('should return an empty array if data.errors is undefined', () => {
    useQuery.mockReturnValue({
      data: undefined,
      isFetching: false,
    });

    const { result } = renderHook(() => useErrorsPreview({ id: '123', enabled: true }));

    expect(result.current.errors).toEqual([]);
    expect(result.current.isFetching).toBe(false);
  });
});
