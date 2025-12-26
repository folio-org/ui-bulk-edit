import {
  QueryClient,
  QueryClientProvider,
} from 'react-query';

import {
  renderHook,
  waitFor,
} from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';
import { ALL_RECORDS_CQL, batchRequest } from '@folio/stripes-acq-components';

import {
  BULK_EDIT_PROFILES_API,
  CAPABILITIES,
} from '../../constants';
import { useBulkEditProfiles } from './useBulkEditProfiles';
import { useErrorMessages } from '../useErrorMessages';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

const profiles = [
  { id: '1', entityType: CAPABILITIES.INSTANCE_MARC, updatedBy: 'userId', userFullName: 'Smith, John ' },
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

const mockShowErrorMessage = jest.fn();
const mockShowExternalModuleError = jest.fn();

jest.mock('../useErrorMessages', () => ({
  useErrorMessages: jest.fn(),
}));

jest.mock('@folio/stripes-acq-components', () => ({
  ...jest.requireActual('@folio/stripes-acq-components'),
  batchRequest: jest.fn().mockReturnValue((Promise.resolve([{ users: [{ id: 'userId', personal: { firstName: 'John', lastName: 'Smith' } }] }]))),
}));

describe('useBulkEditProfiles', () => {
  beforeEach(() => {
    kyMock.get.mockReturnValue({
      json: jest.fn()
        .mockResolvedValueOnce({ content: profiles })
        .mockResolvedValue({ content: [] }),
    });

    useOkapiKy.mockReturnValue(kyMock);
    useErrorMessages.mockReturnValue({
      showErrorMessage: mockShowErrorMessage,
      showExternalModuleError: mockShowExternalModuleError,
    });

    batchRequest.mockReturnValue(Promise.resolve([{ users: [{ id: 'userId', personal: { firstName: 'John', lastName: 'Smith' } }] }]));
  });

  afterEach(() => {
    jest.clearAllMocks();
    queryClient.clear();
  });

  it('should fetch bulk edit profiles with the correct parameters', async () => {
    const entityTypes = [CAPABILITIES.INSTANCE, CAPABILITIES.INSTANCE_MARC];
    const params = { entityTypes };

    const first = renderHook(() => useBulkEditProfiles(params), { wrapper });

    await waitFor(() => expect(first.result.current.isFetching).toBeFalsy());

    expect(kyMock.get).toHaveBeenLastCalledWith(BULK_EDIT_PROFILES_API, expect.objectContaining({
      searchParams: expect.objectContaining({ query: `(entityType=="${CAPABILITIES.INSTANCE}" OR entityType=="${CAPABILITIES.INSTANCE_MARC}") sortBy name/sort.ascending` }),
    }));
    expect(first.result.current.profiles).toEqual(profiles);

    const second = renderHook(() => useBulkEditProfiles({ entityTypes: [] }), { wrapper });

    await waitFor(() => expect(second.result.current.isFetching).toBeFalsy());

    expect(kyMock.get).toHaveBeenCalledWith(BULK_EDIT_PROFILES_API, expect.objectContaining({
      searchParams: expect.objectContaining({ query: `${ALL_RECORDS_CQL} sortBy name/sort.ascending` }),
    }));
  });

  it('should call showErrorMessage when profiles API fails', async () => {
    const profilesError = new Error('Profiles API error');
    const kyErrorMock = {
      get: jest.fn().mockReturnValue({
        json: jest.fn().mockRejectedValue(profilesError),
      }),
    };

    useOkapiKy.mockReturnValue(kyErrorMock);

    const { result } = renderHook(() => useBulkEditProfiles(), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(mockShowErrorMessage).toHaveBeenCalled();
    expect(mockShowExternalModuleError).not.toHaveBeenCalled();
  });

  it('should call showExternalModuleError when users API fails', async () => {
    const usersError = new Error('Users API error');

    kyMock.get.mockReturnValue({
      json: jest.fn().mockResolvedValue({ content: profiles }),
    });

    batchRequest.mockRejectedValueOnce(usersError);

    const { result } = renderHook(() => useBulkEditProfiles(), { wrapper });

    await waitFor(() => expect(result.current.isFetching).toBeFalsy());

    expect(mockShowExternalModuleError).toHaveBeenCalled();
    expect(mockShowErrorMessage).not.toHaveBeenCalled();
  });
});
