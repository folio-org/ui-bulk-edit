import { useHistory } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react-hooks';

import { buildSearch } from '@folio/stripes-acq-components';

import { useCommitChanges } from './useCommitChanges';
import { useSearchParams } from './useSearchParams';
import { useErrorMessages } from './useErrorMessages';
import { useBulkOperationStart } from './api';
import { APPROACHES, EDITING_STEPS } from '../constants';


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

describe('useCommitChanges', () => {
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

  it('should commit changes successfully', async () => {
    const onChangesCommited = jest.fn();

    mockBulkOperationStart.mockResolvedValueOnce();

    const { result } = renderHook(() => useCommitChanges({ bulkOperationId: '123', onChangesCommited }));

    await act(async () => {
      await result.current.commitChanges();
    });

    expect(mockBulkOperationStart).toHaveBeenCalledWith({
      id: '123',
      approach: APPROACHES.IN_APP,
      step: EDITING_STEPS.COMMIT,
    });
    expect(mockSetQueriesData).toHaveBeenCalledWith('bulkOperationDetailsKey', { processedNumOfRecords: 0 });
    expect(onChangesCommited).toHaveBeenCalled();
    expect(mockReplace).toHaveBeenCalledWith({
      pathname: '/bulk-edit/123/preview',
      search: '?progress=testCriteria&?query=test',
    });
  });

  it('should show an error message when commit fails', async () => {
    const onChangesCommited = jest.fn();
    const error = new Error('Commit failed');

    mockBulkOperationStart.mockRejectedValueOnce(error);

    const { result } = renderHook(() => useCommitChanges({ bulkOperationId: '123', onChangesCommited }));

    await act(async () => {
      await result.current.commitChanges();
    });

    expect(mockBulkOperationStart).toHaveBeenCalledWith({
      id: '123',
      approach: APPROACHES.IN_APP,
      step: EDITING_STEPS.COMMIT,
    });
    expect(mockShowErrorMessage).toHaveBeenCalledWith(error);
    expect(onChangesCommited).not.toHaveBeenCalled();
    expect(mockReplace).not.toHaveBeenCalled();
  });
});
