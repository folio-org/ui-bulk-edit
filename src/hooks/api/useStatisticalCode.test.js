import { QueryClient, QueryClientProvider } from 'react-query';
import { renderHook } from '@testing-library/react-hooks';

import { useNamespace, useOkapiKy } from '@folio/stripes/core';

import { useErrorMessages } from '../useErrorMessages';
import { useStatisticalCodes, STATISTICAL_CODES_KEY } from './useStatisticalCodes';
import { mapAndSortStatisticalCodes } from '../../utils/helpers';


jest.mock('@folio/stripes/core', () => ({
  useNamespace: jest.fn(),
  useOkapiKy: jest.fn(),
  useStripes: jest.fn().mockReturnValue(({ config: { maxUnpagedResourceCount: 1000 } })),
}));

jest.mock('../useErrorMessages', () => ({
  useErrorMessages: jest.fn(),
}));

jest.mock('../../utils/helpers', () => ({
  mapAndSortStatisticalCodes: jest.fn(),
}));

describe('useStatisticalCodes', () => {
  const queryClient = new QueryClient();
  const wrapper = ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );

  const mockNamespaceKey = `${STATISTICAL_CODES_KEY}_namespace`;
  const mockKy = {
    get: jest.fn(),
  };
  const mockShowErrorMessage = jest.fn();
  const mockMappedStatisticalCodes = [{ id: '1', name: 'Code 1' }];

  beforeEach(() => {
    jest.clearAllMocks();

    useNamespace.mockReturnValue([mockNamespaceKey]);
    useOkapiKy.mockReturnValue(mockKy);
    useErrorMessages.mockReturnValue({ showErrorMessage: mockShowErrorMessage });
    mapAndSortStatisticalCodes.mockReturnValue(mockMappedStatisticalCodes);
  });

  it('should fetch and return statistical codes data', async () => {
    const statisticalCodeTypes = [{ id: 'type1', name: 'Type 1' }];
    const statisticalCodes = [{ id: 'code1', name: 'Code 1' }];

    mockKy.get.mockImplementation((url) => {
      if (url === 'statistical-code-types') {
        return {
          json: async () => ({ statisticalCodeTypes }),
        };
      }

      if (url === 'statistical-codes') {
        return {
          json: async () => ({ statisticalCodes }),
        };
      }

      throw new Error('Unexpected URL');
    });

    const { result, waitFor } = renderHook(() => useStatisticalCodes(), { wrapper });

    await waitFor(() => !result.current.isStatisticalCodesLoading);

    expect(result.current.statisticalCodes).toEqual(mockMappedStatisticalCodes);
    expect(result.current.isStatisticalCodesLoading).toBe(false);
    expect(mockKy.get).toHaveBeenCalledWith('statistical-code-types', {
      searchParams: { query: 'cql.allRecords=1', limit: 1000 },
    });
    expect(mockKy.get).toHaveBeenCalledWith('statistical-codes', {
      searchParams: { query: 'cql.allRecords=1', limit: 1000 },
    });
    expect(mapAndSortStatisticalCodes).toHaveBeenCalledWith([
      statisticalCodeTypes,
      statisticalCodes,
    ]);
  });

  it('should handle errors and call showErrorMessage', async () => {
    const error = new Error('Failed to fetch');
    mockKy.get.mockRejectedValue(error);

    const { result, waitFor } = renderHook(() => useStatisticalCodes(), { wrapper });

    await waitFor(() => !result.current.isStatisticalCodesLoading);

    expect(result.current.statisticalCodes).toEqual([{
      id: '1',
      name: 'Code 1',
    }]);
    expect(result.current.isStatisticalCodesLoading).toBe(false);
  });
});
