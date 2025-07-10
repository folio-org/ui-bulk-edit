import { renderHook } from '@folio/jest-config-stripes/testing-library/react-hooks';import { useQuery } from 'react-query';

import { useNamespace, useOkapiKy } from '@folio/stripes/core';

import { useErrorMessages } from '../useErrorMessages';
import { useLoanTypes, LOAN_TYPES_KEY } from './useLoanTypes';

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

describe('useLoanTypes', () => {
  const mockGet = jest.fn();
  const mockShowExternalModuleError = jest.fn();
  const kyMock = { get: mockGet };

  beforeEach(() => {
    jest.clearAllMocks();

    useNamespace.mockReturnValue([`${LOAN_TYPES_KEY}_NAMESPACE`]);
    useOkapiKy.mockReturnValue(kyMock);
    useErrorMessages.mockReturnValue({ showExternalModuleError: mockShowExternalModuleError });
  });

  it('should return loan types when data is available', async () => {
    const mockData = {
      loantypes: [
        { id: '1', name: 'Loan Type 1' },
        { id: '2', name: 'Loan Type 2' },
      ],
    };

    useQuery.mockReturnValue({
      data: mockData,
      isLoading: false,
    });

    const { result } = renderHook(() => useLoanTypes());

    expect(result.current.loanTypes).toEqual([
      { label: 'Loan Type 1', value: '1' },
      { label: 'Loan Type 2', value: '2' },
    ]);
    expect(result.current.isLoading).toBe(false);
    expect(useNamespace).toHaveBeenCalledWith({ key: LOAN_TYPES_KEY });
    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({ queryKey: [`${LOAN_TYPES_KEY}_NAMESPACE`] })
    );
  });

  it('should handle loading state correctly', () => {
    useQuery.mockReturnValue({
      data: null,
      isLoading: true,
    });

    const { result } = renderHook(() => useLoanTypes());

    expect(result.current.loanTypes).toEqual([]);
    expect(result.current.isLoading).toBe(true);
  });

  it('should allow passing additional options to useQuery', () => {
    const additionalOptions = { refetchInterval: 5000 };

    useQuery.mockReturnValue({
      data: null,
      isLoading: false,
    });

    renderHook(() => useLoanTypes(additionalOptions));

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining(additionalOptions)
    );
  });
});
