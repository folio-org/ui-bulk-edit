import { renderHook } from '@testing-library/react-hooks';
import { useQuery } from 'react-query';
import { useOkapiKy } from '@folio/stripes/core';
import { useAllPermissions } from './useAllPermissions'; // Adjust the import path as per your project structure

import '../../../../test/jest/__mock__/stripesCore.mock';

jest.mock('../../../hooks/useSearchParams', () => ({
  useSearchParams: jest.fn().mockReturnValue({ initialFileName: 'initialFileName' }),
}));


jest.mock('react-query', () => ({
  useQuery: jest.fn(),
}));

describe('useAllPermissions', () => {
  beforeEach(() => {
    useQuery.mockReset();
    useOkapiKy.mockReset();
  });

  it('should fetch permissions and return them', () => {
    const permissionsData = {
      permissions: [
        { id: '1', name: 'Permission 1', mutable: true },
        { id: '2', name: 'Permission 2', mutable: false },
      ],
    };

    const mockKyInstance = {
      get: jest.fn().mockReturnValueOnce({ json: () => permissionsData }),
    };

    useOkapiKy.mockReturnValue(mockKyInstance);
    useQuery.mockReturnValue({ data: permissionsData, isLoading: false });

    const { result } = renderHook(() => useAllPermissions());

    expect(useOkapiKy).toHaveBeenCalledTimes(1);
    expect(useQuery).toHaveBeenCalledTimes(1);

    expect(result.current.permissions).toEqual(permissionsData);
    expect(result.current.isPermissionsLoading).toBe(false);
  });

  it('should handle loading state', () => {
    useQuery.mockReturnValue({ data: null, isLoading: true });

    const { result } = renderHook(() => useAllPermissions());

    expect(result.current.permissions).toBe(null);
    expect(result.current.isPermissionsLoading).toBe(true);
  });
});
