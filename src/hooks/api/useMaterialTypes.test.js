import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { useQuery } from 'react-query';

import { useNamespace, useOkapiKy } from '@folio/stripes/core';

import { useErrorMessages } from '../useErrorMessages';
import { useMaterialTypes, MATERIAL_TYPES_KEY } from './useMaterialTypes';

jest.mock('@folio/stripes/core', () => ({
  useNamespace: jest.fn(),
  useOkapiKy: jest.fn(),
  useStripes: jest.fn().mockReturnValue(({ config: { maxUnpagedResourceCount: 1000 } })),
}));

jest.mock('react-query', () => ({
  useQuery: jest.fn(),
}));

jest.mock('../useErrorMessages', () => ({
  useErrorMessages: jest.fn(),
}));

describe('useMaterialTypes', () => {
  const mockGet = jest.fn();
  const mockShowExternalModuleError = jest.fn();
  const kyMock = { get: mockGet };

  beforeEach(() => {
    jest.clearAllMocks();

    useNamespace.mockReturnValue([`${MATERIAL_TYPES_KEY}_NAMESPACE`]);
    useOkapiKy.mockReturnValue(kyMock);
    useErrorMessages.mockReturnValue({ showExternalModuleError: mockShowExternalModuleError });
  });

  it('should return material types when data is available', async () => {
    const mockData = {
      mtypes: [
        { id: '1', name: 'Material Type 1' },
        { id: '2', name: 'Material Type 2' },
      ],
    };

    useQuery.mockReturnValue({
      data: mockData,
      isLoading: false,
    });

    const { result } = renderHook(() => useMaterialTypes());

    expect(result.current.materialTypes).toEqual([
      { label: 'Material Type 1', value: '1' },
      { label: 'Material Type 2', value: '2' },
    ]);
    expect(result.current.isLoading).toBe(false);
    expect(useNamespace).toHaveBeenCalledWith({ key: MATERIAL_TYPES_KEY });
    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: [`${MATERIAL_TYPES_KEY}_NAMESPACE`] })
    );
  });

  it('should handle loading state correctly', () => {
    useQuery.mockReturnValue({
      data: null,
      isLoading: true,
    });

    const { result } = renderHook(() => useMaterialTypes());

    expect(result.current.materialTypes).toEqual([]);
    expect(result.current.isLoading).toBe(true);
  });

  it('should allow passing additional options to useQuery', () => {
    const additionalOptions = { refetchInterval: 5000 };

    useQuery.mockReturnValue({
      data: null,
      isLoading: false,
    });

    renderHook(() => useMaterialTypes(additionalOptions));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining(additionalOptions)
    );
  });

  it('should call ky.get with correct path and search params in queryFn', async () => {
    let capturedQueryFn;
    useQuery.mockImplementation((config) => {
      capturedQueryFn = config.queryFn;
      return { data: null, isLoading: false };
    });

    const mockJson = jest.fn().mockResolvedValue({ mtypes: [] });
    mockGet.mockReturnValue({ json: mockJson });

    renderHook(() => useMaterialTypes());

    await capturedQueryFn();

    expect(mockGet).toHaveBeenCalledWith('material-types', {
      searchParams: {
        query: 'cql.allRecords=1 sortby name',
        limit: 1000,
      },
    });
  });
});

