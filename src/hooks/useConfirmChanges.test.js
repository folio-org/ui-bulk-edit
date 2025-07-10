import { useQueryClient } from 'react-query';
import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react-hooks';

import { useShowCallout } from '@folio/stripes-acq-components';

import '../../test/jest/__mock__/reactIntl.mock';

import { useBulkOperationDetails, useBulkOperationStart } from './api';
import { useSearchParams } from './useSearchParams';
import { useConfirmChanges } from './useConfirmChanges';
import { pollForStatus } from '../utils/pollForStatus';

jest.mock('react-query', () => ({
  useQueryClient: jest.fn(),
}));

jest.mock('@folio/stripes/core', () => ({
  ...jest.requireActual('@folio/stripes/core'),
  useOkapiKy: jest.fn(),
  useModuleInfo: jest.fn()
}));

jest.mock('@folio/stripes-acq-components', () => ({
  useShowCallout: jest.fn(),
}));

jest.mock('./api', () => ({
  useBulkOperationDetails: jest.fn(),
  useBulkOperationStart: jest.fn(),
}));

jest.mock('./useSearchParams', () => ({
  useSearchParams: jest.fn(),
}));

jest.mock('../utils/pollForStatus');

describe('useConfirmChanges', () => {
  const mockCallout = jest.fn();
  const mockQueryClient = {
    invalidateQueries: jest.fn(),
    setQueriesData: jest.fn(),
    removeQueries: jest.fn(),
    resetQueries: jest.fn(),
  };
  const mockBulkOperationDetails = { bulkDetails: { totalNumOfRecords: 100 } };
  const mockBulkOperationStart = jest.fn();

  beforeEach(() => {
    useShowCallout.mockReturnValue(mockCallout);
    useQueryClient.mockReturnValue(mockQueryClient);
    useBulkOperationDetails.mockReturnValue(mockBulkOperationDetails);
    useBulkOperationStart.mockReturnValue({ bulkOperationStart: mockBulkOperationStart });
    useSearchParams.mockReturnValue({ criteria: 'testCriteria', initialFileName: 'initialFileName' });
    pollForStatus.mockImplementation(() => Promise.resolve());

    jest.clearAllMocks();
  });

  it('should initialize hook state correctly', () => {
    const { result } = renderHook(() => useConfirmChanges({
      queryDownloadKey: 'testKey',
      bulkOperationId: '123',
    }));

    expect(result.current.totalRecords).toBe(100);
    expect(result.current.isPreviewModalOpened).toBe(false);
    expect(result.current.isJobPreparing).toBe(false);
  });

  it('should open and close the preview modal', () => {
    const { result } = renderHook(() => useConfirmChanges({
      queryDownloadKey: 'testKey',
      bulkOperationId: '123',
    }));

    act(() => {
      result.current.openPreviewModal();
    });
    expect(result.current.isPreviewModalOpened).toBe(true);

    act(() => {
      result.current.closePreviewModal();
    });
    expect(result.current.isPreviewModalOpened).toBe(false);
  });

  it('should handle confirmChanges function correctly', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useConfirmChanges({
      queryDownloadKey: 'testKey',
      bulkOperationId: '123',
    }));

    // Call confirmChanges with a mock payload
    act(() => {
      result.current.confirmChanges({});
    });

    // Check if loading state is set
    expect(result.current.isJobPreparing).toBe(true);

    // Wait for the next update after the async calls
    await waitForNextUpdate(); // Wait for the polling to start

    // Finally, check if loading state is set back to false
    expect(result.current.isJobPreparing).toBe(false);
  });

  it('should handle error in confirmChanges function', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useConfirmChanges({
      queryDownloadKey: 'testKey',
      bulkOperationId: '123',
    }));

    act(() => {
      result.current.confirmChanges(() => Promise.reject(new Error()));
    });

    // Check if loading state is set
    expect(result.current.isJobPreparing).toBe(true);

    // Wait for the next update after the async calls
    await waitForNextUpdate();

    // Check that loading state is set back to false after handling the error
    expect(result.current.isJobPreparing).toBe(false);
    expect(result.current.isPreviewModalOpened).toBe(false); // Modal should close on error
  });

  it('should handle changePreviewSettled function correctly', async () => {
    const { result } = renderHook(() => useConfirmChanges({
      queryDownloadKey: 'testKey',
      bulkOperationId: '123',
    }));

    expect(result.current.isPreviewSettled).toBe(false);

    act(() => {
      result.current.changePreviewSettled();
    });

    expect(result.current.isPreviewSettled).toBe(true);
  });
});
