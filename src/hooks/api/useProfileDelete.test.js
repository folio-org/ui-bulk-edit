import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';

import { BULK_EDIT_PROFILES_API } from '../../constants';
import { useProfileDelete } from './useProfileDelete';

const wrapper = ({ children }) => (
  <QueryClientProvider client={new QueryClient()}>
    {children}
  </QueryClientProvider>
);

const kyMock = {
  delete: jest.fn(() => ({
    json: jest.fn().mockResolvedValue({}),
  })),
};

describe('useBulkEditProfiles', () => {
  beforeEach(() => {
    useOkapiKy.mockReturnValue(kyMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should call delete API on deleteProfile call', async () => {
    const { result } = renderHook(() => useProfileDelete({
      onSuccess: jest.fn()
    }), { wrapper });

    await result.current.deleteProfile({ profileId: '123' });

    expect(kyMock.delete).toHaveBeenCalledWith(`${BULK_EDIT_PROFILES_API}/123`);
  });
});
