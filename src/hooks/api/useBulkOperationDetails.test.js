import { renderHook, act } from '@testing-library/react-hooks';
import { useQuery } from 'react-query';
import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { useHistory } from 'react-router-dom';
import { useBulkOperationDetails, BULK_OPERATION_DETAILS_KEY } from './useBulkOperationDetails';
import { useErrorMessages } from '../useErrorMessages';


jest.mock('@folio/stripes-acq-components', () => ({
  buildSearch: jest.fn(),
}));

jest.mock('react-query', () => ({
  useQuery: jest.fn(),
}));

jest.mock('@folio/stripes/core', () => ({
  useNamespace: jest.fn(),
  useOkapiKy: jest.fn(),
}));

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn(),
}));

jest.mock('../useErrorMessages', () => ({
  useErrorMessages: jest.fn(),
}));

describe('useBulkOperationDetails', () => {
  let kyMock;
  let historyMock;
  let showErrorMessageMock;

  beforeEach(() => {
    kyMock = { get: jest.fn() };
    historyMock = { replace: jest.fn(), location: { search: '' } };
    showErrorMessageMock = jest.fn();

    useOkapiKy.mockReturnValue(kyMock);
    useNamespace.mockReturnValue(['namespace-key']);
    useHistory.mockReturnValue(historyMock);
    useErrorMessages.mockReturnValue({ showErrorMessage: showErrorMessageMock });

    // Set a default implementation for useQuery to prevent infinite renders
    useQuery.mockReturnValue({ data: null, isLoading: false });
    jest.clearAllMocks();
  });

  it('should initialize with the correct refetch interval and query key', () => {
    const id = 'test-id';
    const refetchInterval = 5000;

    const { result } = renderHook(() => useBulkOperationDetails({ id, interval: refetchInterval }));

    expect(result.current.isLoading).toBe(false);
    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [BULK_OPERATION_DETAILS_KEY, 'namespace-key', id, refetchInterval],
        refetchInterval,
        enabled: true,
      })
    );
  });

  it('should clear interval and redirect when clearIntervalAndRedirect is called', () => {
    const id = 'test-id';
    const pathname = '/new-path';
    const searchParams = { query: 'test' };

    const { result } = renderHook(() => useBulkOperationDetails({ id }));

    act(() => {
      result.current.clearIntervalAndRedirect(pathname, searchParams);
    });

    expect(historyMock.replace).toHaveBeenCalledWith({
      pathname,
      search: undefined,
    });
  });
});
