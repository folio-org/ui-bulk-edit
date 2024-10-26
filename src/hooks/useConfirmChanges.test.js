import { useQueryClient } from 'react-query';
import { renderHook, act } from '@testing-library/react-hooks';

import { useShowCallout } from '@folio/stripes-acq-components';

import '../../test/jest/__mock__/reactIntl.mock';

import { useBulkOperationDetails, useBulkOperationStart, useFileDownload } from './api';
import { useSearchParams } from './useSearchParams';
import { useConfirmChanges } from './useConfirmChanges';

jest.mock('react-query', () => ({
  useQueryClient: jest.fn(),
}));

jest.mock('@folio/stripes-acq-components', () => ({
  useShowCallout: jest.fn(),
}));

jest.mock('./api', () => ({
  useBulkOperationDetails: jest.fn(),
  useBulkOperationStart: jest.fn(),
  useFileDownload: jest.fn(),
}));

jest.mock('./useSearchParams', () => ({
  useSearchParams: jest.fn(),
}));


describe('useConfirmChanges', () => {
  const mockCallout = jest.fn();
  const mockQueryClient = { invalidateQueries: jest.fn(), setQueryData: jest.fn() };
  const mockBulkOperationDetails = { bulkDetails: { totalNumOfRecords: 100 } };
  const mockBulkOperationStart = jest.fn();
  const mockUpdateFn = jest.fn(() => Promise.resolve());
  const mockDownloadFile = jest.fn();

  beforeEach(() => {
    useShowCallout.mockReturnValue(mockCallout);
    useQueryClient.mockReturnValue(mockQueryClient);
    useBulkOperationDetails.mockReturnValue(mockBulkOperationDetails);
    useBulkOperationStart.mockReturnValue({ bulkOperationStart: mockBulkOperationStart });
    useSearchParams.mockReturnValue({ criteria: 'testCriteria', initialFileName: 'initialFileName' });
    useFileDownload.mockReturnValue({ refetch: mockDownloadFile, isFetching: false });

    jest.clearAllMocks();
  });

  it('should initialize hook state correctly', () => {
    const { result } = renderHook(() => useConfirmChanges({
      updateFn: mockUpdateFn,
      queryDownloadKey: 'testKey',
      bulkOperationId: '123',
    }));

    expect(result.current.totalRecords).toBe(100);
    expect(result.current.isPreviewModalOpened).toBe(false);
    expect(result.current.isPreviewLoading).toBe(false);
  });

  it('should open and close the preview modal', () => {
    const { result } = renderHook(() => useConfirmChanges({
      updateFn: mockUpdateFn,
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
      updateFn: mockUpdateFn,
      queryDownloadKey: 'testKey',
      bulkOperationId: '123',
    }));

    act(() => {
      result.current.confirmChanges({});
    });

    expect(result.current.isPreviewLoading).toBe(true);
    expect(result.current.isPreviewModalOpened).toBe(true);

    await waitForNextUpdate();

    expect(mockUpdateFn).toHaveBeenCalled();
    expect(mockBulkOperationStart).toHaveBeenCalledWith({
      id: '123',
      approach: 'IN_APP',
      step: 'EDIT',
    });
    expect(result.current.isPreviewLoading).toBe(false);
  });

  it('should handle error in confirmChanges function', async () => {
    mockUpdateFn.mockImplementationOnce(() => Promise.reject());

    const { result, waitForNextUpdate } = renderHook(() => useConfirmChanges({
      updateFn: mockUpdateFn,
      queryDownloadKey: 'testKey',
      bulkOperationId: '123',
    }));

    act(() => {
      result.current.confirmChanges({});
    });

    expect(result.current.isPreviewLoading).toBe(true);
    expect(result.current.isPreviewModalOpened).toBe(true);

    await waitForNextUpdate();

    expect(result.current.isPreviewLoading).toBe(false);
    expect(result.current.isPreviewModalOpened).toBe(false);
  });

  it('should call downloadFile from useFileDownload', () => {
    const { result } = renderHook(() => useConfirmChanges({
      updateFn: mockUpdateFn,
      queryDownloadKey: 'testKey',
      bulkOperationId: '123',
    }));

    act(() => {
      result.current.downloadFile();
    });

    expect(mockDownloadFile).toHaveBeenCalled();
  });
});
