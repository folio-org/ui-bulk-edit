import { renderHook } from '@testing-library/react-hooks';
import { QueryClient, QueryClientProvider } from 'react-query';

import { useOkapiKy } from '@folio/stripes/core';

import { bulkEditLogsData } from '../../../../test/jest/__mock__/fakeData';

import { LOGS_FILTERS, JOB_STATUSES } from '../../../constants';
import { useBulkEditLogs } from './useBulkEditLogs';
import { getFullName } from '../../../utils/getFullName';

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useNamespace: () => ['namespace'],
  useOkapiKy: jest.fn(),
  useStripes: () => ({ timezone: 'UTC' }),
}));

const users = [
  {
    id: 'userId',
    personal: {
      lastName: 'Barn',
      firstName: 'John',
    },
  },
];
const bulkEditLog = { ...bulkEditLogsData[0], userId: users[0].id };
const bulkEditLogs = [bulkEditLog];

const queryClient = new QueryClient();
// eslint-disable-next-line react/prop-types
const wrapper = ({ children }) => (
  <QueryClientProvider client={queryClient}>
    {children}
  </QueryClientProvider>
);

describe('useBulkEditLogs', () => {
  beforeEach(() => {
    useOkapiKy
      .mockClear()
      .mockReturnValue({
        get: () => ({
          json: () => ({
            users,
            bulkOperations: bulkEditLogs,
            totalRecords: bulkEditLogs.length,
          }),
        }),
      });
  });

  it('should return an empty list if there no filters were passed in the query', async () => {
    const { result, waitFor } = renderHook(() => useBulkEditLogs({
      pagination: { limit: 5, offset: 0, timestamp: 42 },
    }), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(result.current).toEqual({
      logs: [],
      logsCount: 0,
      isLoading: false,
    });
  });

  it('should return fetched hydreated logs list', async () => {
    const { result, waitFor } = renderHook(() => useBulkEditLogs({
      pagination: { limit: 5, offset: 0, timestamp: 42 },
      filters: { [LOGS_FILTERS.STATUS]: JOB_STATUSES.COMPLETED },
    }), { wrapper });

    await waitFor(() => !result.current.isLoading);

    expect(result.current).toEqual({
      logs: [{ ...bulkEditLog, runBy: getFullName(users[0].personal) }],
      logsCount: 1,
      isLoading: false,
    });
  });
});
