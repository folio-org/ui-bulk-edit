import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';
import { renderHook } from '@testing-library/react-hooks';
import { waitFor, act } from '@testing-library/react';

import { useBulkOperationUsers } from './useBulkOperationUsers';
import { QUERY_CAPABILITIES } from '../../constants';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
  useNamespace: jest.fn().mockReturnValue(['1', '2', '3']),
}));

const queryClient = new QueryClient();

// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const data = [
  {
    id: '1',
    username: 'admin'
  },
  {
    id: '2',
    username: 'test_admin'
  }
];

describe('useBulkOperationUsers', () => {
  const mockGet = jest.fn(() => ({
    json: () => Promise.resolve(data),
  }));
  beforeEach(() => {
    queryClient.clear();
    useOkapiKy.mockClear().mockReturnValue(
      {
        get: mockGet
      }
    );
  });

  it('should fetch related users', async () => {
    const { result } = renderHook(() => useBulkOperationUsers([QUERY_CAPABILITIES.ITEM]), { wrapper });
    await act(() => !result.current.isLoading);

    await waitFor(() => expect(result.current.isLoading).toBeFalsy());

    expect(result.current.data).toEqual(data);
  });
});
