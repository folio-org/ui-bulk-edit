import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';
import { ALL_RECORDS_CQL } from '@folio/stripes-acq-components';

import {
  BULK_EDIT_PROFILES_API,
  CAPABILITIES,
} from '../../constants';
import { useBulkEditProfiles } from './useBulkEditProfiles';

const wrapper = ({ children }) => (
  <QueryClientProvider client={new QueryClient()}>
    {children}
  </QueryClientProvider>
);

const profiles = [
  { id: '1', entityType: CAPABILITIES.INSTANCE_MARC },
];

const kyMock = {
  get: jest.fn().mockReturnValue({
    json: (
      jest.fn()
        .mockResolvedValueOnce({ content: profiles })
        .mockResolvedValue({ content: [] })
    ),
  }),
};

describe('useBulkEditProfiles', () => {
  beforeEach(() => {
    useOkapiKy.mockReturnValue(kyMock);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch bulk edit profiles with the correct parameters', async () => {
    const entityType = CAPABILITIES.INSTANCE_MARC;
    const params = { entityType };

    const first = renderHook(() => useBulkEditProfiles(params), { wrapper });

    await waitFor(() => expect(first.result.current.isFetching).toBeFalsy());

    expect(kyMock.get).toHaveBeenLastCalledWith(BULK_EDIT_PROFILES_API, expect.objectContaining({
      searchParams: expect.objectContaining({ query: `entityType=="${entityType}" sortBy name/sort.ascending` }),
    }));
    expect(first.result.current.profiles).toEqual(profiles);

    const second = renderHook(() => useBulkEditProfiles(), { wrapper });

    await waitFor(() => expect(second.result.current.isFetching).toBeFalsy());

    expect(kyMock.get).toHaveBeenCalledWith(BULK_EDIT_PROFILES_API, expect.objectContaining({
      searchParams: expect.objectContaining({ query: `${ALL_RECORDS_CQL} sortBy name/sort.ascending` }),
    }));
  });
});
