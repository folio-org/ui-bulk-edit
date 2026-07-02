import { useHistory } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react-hooks';

import { buildSearch } from '@folio/stripes-acq-components';

import { useStartBulkDelete } from './useStartBulkDelete';
import { useSearchParams } from './useSearchParams';
import { useErrorMessages } from './useErrorMessages';
import { useBulkOperationStart } from './api';
import { EDITING_STEPS } from '../constants';

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn(),
}));

jest.mock('react-query', () => ({
  useQueryClient: jest.fn(),
}));

jest.mock('@folio/stripes-acq-components', () => ({
  buildSearch: jest.fn(),
}));

jest.mock('./useSearchParams', () => ({
  useSearchParams: jest.fn(),
}));

jest.mock('./useErrorMessages', () => ({
  useErrorMessages: jest.fn(),
}));

jest.mock('./api', () => ({
  useBulkOperationStart: jest.fn(),
  BULK_OPERATION_DETAILS_KEY: 'bulkOperationDetailsKey',
}));

const mockBulkOperationStart = jest.fn();
const mockSetQueriesData = jest.fn();
const mockReplace = jest.fn();
const mockShowErrorMessage = jest.fn();

describe('useStartBulkDelete', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useHistory.mockReturnValue({
      replace: mockReplace,
      location: { search: '?query=test' },
    });

    useQueryClient.mockReturnValue({
      setQueriesData: mockSetQueriesData,
    });

    buildSearch.mockImplementation(({ progress }, search) => `?progress=${progress}&${search}`);

    useSearchParams.mockReturnValue({
      criteria: 'testCriteria',
    });

    useErrorMessages.mockReturnValue({
      showErrorMessage: mockShowErrorMessage,
    });

    useBulkOperationStart.mockReturnValue({
      bulkOperationStart: mockBulkOperationStart,
    });
  });

  it('should start the bulk delete job successfully', async () => {
    const onDeleteStarted = jest.fn();

    mockBulkOperationStart.mockResolvedValueOnce({ id: '123' });

    const { result } = renderHook(() => useStartBulkDelete({ bulkOperationId: '123', onDeleteStarted }));

    await act(async () => {
      await result.current.startBulkDelete();
    });

    expect(mockBulkOperationStart).toHaveBeenCalledWith({
      id: '123',
      step: EDITING_STEPS.DELETE,
    });
    expect(mockSetQueriesData).toHaveBeenCalledWith('bulkOperationDetailsKey', { id: '123', processedNumOfRecords: 0 });
    expect(onDeleteStarted).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith({
      pathname: '/bulk-edit/123/preview',
      search: '?progress=testCriteria&?query=test',
    });
  });

  it('should show an error message when the bulk delete job fails', async () => {
    const onDeleteStarted = jest.fn();
    const error = new Error('Delete failed');

    mockBulkOperationStart.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useStartBulkDelete({ bulkOperationId: '123', onDeleteStarted }));

    await act(async () => {
      await result.current.startBulkDelete();
    });

    expect(mockShowErrorMessage).toHaveBeenCalledWith(error);
    expect(onDeleteStarted).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});

