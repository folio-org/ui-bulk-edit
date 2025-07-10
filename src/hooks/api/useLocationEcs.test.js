import { renderHook } from '@folio/jest-config-stripes/testing-library/react-hooks';import { useQuery } from 'react-query';

import { useNamespace } from '@folio/stripes/core';

import { usePublishCoordinator } from '../usePublishCoordinator';
import { useLocationEcs } from './useLocationEcs';


jest.mock('react-query', () => ({
  useQuery: jest.fn(),
}));

jest.mock('@folio/stripes/core', () => ({
  useNamespace: jest.fn(),
}));

jest.mock('../usePublishCoordinator', () => ({
  usePublishCoordinator: jest.fn(),
}));

describe('useLocationEcs', () => {
  const mockNamespace = 'testNamespace';
  const mockInitPublicationRequest = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    useNamespace.mockReturnValue([mockNamespace]);
    usePublishCoordinator.mockReturnValue({
      initPublicationRequest: mockInitPublicationRequest,
    });
  });

  it('returns default values when query is fetching or no data is available', () => {
    useQuery.mockReturnValue({
      data: undefined,
      isFetching: true,
    });

    const { result } = renderHook(() => useLocationEcs(['tenant1']));

    expect(result.current.locationsEcs).toEqual([]);
    expect(result.current.isFetching).toBe(true);
  });

  it('formats locations data correctly when query returns data', async () => {
    const mockData = [
      {
        tenantId: 'tenant1',
        response: {
          locations: [
            { id: 'loc1', name: 'Location 1' },
            { id: 'loc2', name: 'Location 2' },
          ],
        },
      },
      {
        tenantId: 'tenant2',
        response: {
          locations: [
            { id: 'loc3', name: 'Location 3' },
          ],
        },
      },
    ];

    useQuery.mockReturnValue({
      data: mockData,
      isFetching: false,
    });

    mockInitPublicationRequest.mockResolvedValue({
      publicationResults: mockData,
    });

    const { result } = renderHook(() => useLocationEcs(['tenant1', 'tenant2']));

    expect(result.current.locationsEcs).toEqual([
      {
        value: 'loc1',
        label: 'Location 1 (tenant1)',
        tenant: 'tenant1',
      },
      {
        value: 'loc2',
        label: 'Location 2 (tenant1)',
        tenant: 'tenant1',
      },
      {
        value: 'loc3',
        label: 'Location 3 (tenant2)',
        tenant: 'tenant2',
      },
    ]);
    expect(result.current.isFetching).toBe(false);
  });

  it('handles errors gracefully when the query fails', async () => {
    useQuery.mockReturnValue({
      data: undefined,
      isFetching: false,
    });

    mockInitPublicationRequest.mockRejectedValue(new Error('Network error'));

    const { result } = renderHook(() => useLocationEcs(['tenant1']));

    expect(result.current.locationsEcs).toEqual([]);
    expect(result.current.isFetching).toBe(false);
  });

  it('applies additional query options if provided', () => {
    const mockOptions = { retry: false };

    useQuery.mockReturnValue({
      data: [],
      isFetching: false,
    });

    renderHook(() => useLocationEcs(['tenant1'], mockOptions));

    expect(useQuery).toHaveBeenCalledWith(expect.objectContaining(mockOptions));
  });
});
