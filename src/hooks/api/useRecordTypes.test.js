import { renderHook } from '@folio/jest-config-stripes/testing-library/react-hooks';import { useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';
import { act } from '@folio/jest-config-stripes/testing-library/react';
import { useRecordTypes } from './useRecordTypes';

import '../../../test/jest/__mock__/stripesCore.mock';

jest.mock('react-query', () => ({
  ...jest.requireActual('react-query'),
  useQuery: jest.fn(),
}));

jest.mock('../useSearchParams', () => ({
  useSearchParams: jest.fn().mockReturnValue({ initialFileName: 'initialFileName' }),
}));

jest.mock('../useErrorMessages', () => ({
  useErrorMessages: jest.fn().mockReturnValue({ showExternalModuleError: jest.fn() }),
}));

describe('useRecordTypes', () => {
  it('should return recordTypes, loading state, and error state', async () => {
    useOkapiKy.mockReturnValue({
      get: jest.fn().mockResolvedValue({ json: jest.fn().mockResolvedValue({}) }),
    });

    useQuery.mockReturnValue({
      data: [
        {
          'id': '1',
          'label': 'Loans'
        },
        {
          'id': '2',
          'label': 'Users'
        },
        {
          'id': '3',
          'label': 'Items'
        }
      ],
      isLoading: false,
      error: null,
    });

    let result;
    await act(async () => {
      result = renderHook(() => useRecordTypes({ enabled: true })).result;
    });

    expect(result.current.recordTypes).toEqual([
      {
        'id': '1',
        'label': 'Loans'
      },
      {
        'id': '2',
        'label': 'Users'
      },
      {
        'id': '3',
        'label': 'Items'
      }
    ]);
    expect(result.current.isLoading).toBeFalsy();
    expect(result.current.error).toBeNull();
  });
});
