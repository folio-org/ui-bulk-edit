import { renderHook, act } from '@folio/jest-config-stripes/testing-library/react-hooks';
import { useHistory } from 'react-router-dom';
import { useQueryClient } from 'react-query';
import { buildSearch } from '@folio/stripes-acq-components';
import queryString from 'query-string';

import { CRITERIA } from '../constants';

const BULK_OPERATION_DETAILS_KEY = 'bulkOperationDetails';

jest.mock('react-router-dom', () => ({
  useHistory: jest.fn(),
}));

jest.mock('react-query', () => ({
  useQueryClient: jest.fn(),
}));

jest.mock('@folio/stripes-acq-components', () => ({
  buildSearch: jest.fn(),
}));

jest.mock('query-string', () => ({
  parse: jest.fn(),
}));

jest.mock('./api', () => ({
  BULK_OPERATION_DETAILS_KEY: 'bulkOperationDetails',
}));

const { useResetAppState } = require('./useResetAppState');

describe('useResetAppState', () => {
  const mockSetConfirmedFileName = jest.fn();
  const mockSetVisibleColumns = jest.fn();
  const mockSetCountOfRecords = jest.fn();
  const mockCloseInAppLayer = jest.fn();
  const mockCloseMarcLayer = jest.fn();
  const mockHistoryReplace = jest.fn();
  const mockRemoveQueries = jest.fn();
  const mockFiltersTab = {
    logsTab: ['status', 'entityType', 'operationType', 'startTime', 'endTime'],
  };

  const mockHistory = {
    location: {
      pathname: '/bulk-edit',
      search: '',
    },
    replace: mockHistoryReplace,
  };

  const mockQueryClient = {
    removeQueries: mockRemoveQueries,
  };

  const defaultProps = {
    setConfirmedFileName: mockSetConfirmedFileName,
    setVisibleColumns: mockSetVisibleColumns,
    setCountOfRecords: mockSetCountOfRecords,
    filtersTab: mockFiltersTab,
    closeInAppLayer: mockCloseInAppLayer,
    closeMarcLayer: mockCloseMarcLayer,
  };

  beforeEach(() => {
    // Reset mockHistory to default state
    mockHistory.location.pathname = '/bulk-edit';
    mockHistory.location.search = '';

    useHistory.mockReturnValue(mockHistory);
    useQueryClient.mockReturnValue(mockQueryClient);
    buildSearch.mockImplementation((params) => `search=${JSON.stringify(params)}`);
    queryString.parse.mockReturnValue({});
    jest.clearAllMocks();
  });

  describe('hook initialization', () => {
    it('should return resetAppState function', () => {
      const { result } = renderHook(() => useResetAppState(defaultProps));

      expect(result.current).toHaveProperty('resetAppState');
      expect(typeof result.current.resetAppState).toBe('function');
    });
  });

  describe('resetAppState function', () => {
    it('should reset state and preserve current criteria from URL', () => {
      queryString.parse.mockReturnValue({ criteria: CRITERIA.QUERY });
      mockHistory.location.search = '?criteria=query&identifier=123';

      const { result } = renderHook(() => useResetAppState(defaultProps));

      act(() => {
        result.current.resetAppState();
      });

      expect(mockSetCountOfRecords).toHaveBeenCalledWith(0);
      expect(mockRemoveQueries).toHaveBeenCalledWith({ queryKey: [BULK_OPERATION_DETAILS_KEY] });
      expect(mockSetConfirmedFileName).toHaveBeenCalledWith(null);
      expect(mockSetVisibleColumns).toHaveBeenCalledWith(null);
      expect(mockCloseInAppLayer).toHaveBeenCalled();
      expect(mockCloseMarcLayer).toHaveBeenCalled();
      expect(buildSearch).toHaveBeenCalledWith({
        criteria: CRITERIA.QUERY,
        identifier: '',
        capabilities: '',
        status: 'status',
        entityType: 'entityType',
        operationType: 'operationType',
        startTime: 'startTime',
        endTime: 'endTime',
      });
      expect(mockHistoryReplace).toHaveBeenCalledWith({
        pathname: '/bulk-edit',
        search: expect.any(String),
      });
    });

    it('should use default CRITERIA.IDENTIFIER when no criteria in URL', () => {
      queryString.parse.mockReturnValue({});
      mockHistory.location.search = '';

      const { result } = renderHook(() => useResetAppState(defaultProps));

      act(() => {
        result.current.resetAppState();
      });

      expect(buildSearch).toHaveBeenCalledWith({
        criteria: CRITERIA.IDENTIFIER,
        identifier: '',
        capabilities: '',
        status: 'status',
        entityType: 'entityType',
        operationType: 'operationType',
        startTime: 'startTime',
        endTime: 'endTime',
      });
    });

    it('should preserve CRITERIA.LOGS from URL', () => {
      queryString.parse.mockReturnValue({ criteria: CRITERIA.LOGS });
      mockHistory.location.search = '?criteria=logs';

      const { result } = renderHook(() => useResetAppState(defaultProps));

      act(() => {
        result.current.resetAppState();
      });

      expect(buildSearch).toHaveBeenCalledWith({
        criteria: CRITERIA.LOGS,
        identifier: '',
        capabilities: '',
        status: 'status',
        entityType: 'entityType',
        operationType: 'operationType',
        startTime: 'startTime',
        endTime: 'endTime',
      });
    });
  });

  describe('useEffect - automatic reset on navigation', () => {
    it('should trigger reset when navigating to /bulk-edit without search params', () => {
      mockHistory.location.pathname = '/bulk-edit';
      mockHistory.location.search = '';

      renderHook(() => useResetAppState(defaultProps));

      expect(mockSetCountOfRecords).toHaveBeenCalledWith(0);
      expect(mockRemoveQueries).toHaveBeenCalledWith({ queryKey: [BULK_OPERATION_DETAILS_KEY] });
      expect(mockSetConfirmedFileName).toHaveBeenCalledWith(null);
      expect(mockSetVisibleColumns).toHaveBeenCalledWith(null);
      expect(buildSearch).toHaveBeenCalledWith({
        criteria: CRITERIA.IDENTIFIER,
        identifier: '',
        capabilities: '',
        status: 'status',
        entityType: 'entityType',
        operationType: 'operationType',
        startTime: 'startTime',
        endTime: 'endTime',
      });
    });

    it('should not trigger reset when on /bulk-edit with search params', () => {
      mockHistory.location.pathname = '/bulk-edit';
      mockHistory.location.search = '?criteria=query';

      renderHook(() => useResetAppState(defaultProps));

      expect(mockSetCountOfRecords).not.toHaveBeenCalled();
      expect(mockRemoveQueries).not.toHaveBeenCalled();
      expect(mockSetConfirmedFileName).not.toHaveBeenCalled();
    });

    it('should not trigger reset when on different pathname', () => {
      mockHistory.location.pathname = '/some-other-route';
      mockHistory.location.search = '';

      renderHook(() => useResetAppState(defaultProps));

      expect(mockSetCountOfRecords).not.toHaveBeenCalled();
      expect(mockRemoveQueries).not.toHaveBeenCalled();
      expect(mockSetConfirmedFileName).not.toHaveBeenCalled();
    });
  });

  describe('filtersTab.logsTab values', () => {
    it('should use all values from filtersTab.logsTab array', () => {
      const customFiltersTab = {
        logsTab: ['customStatus', 'customEntity', 'customOp', 'customStart', 'customEnd'],
      };

      const { result } = renderHook(() => useResetAppState({
        ...defaultProps,
        filtersTab: customFiltersTab,
      }));

      act(() => {
        result.current.resetAppState();
      });

      expect(buildSearch).toHaveBeenCalledWith({
        criteria: CRITERIA.IDENTIFIER,
        identifier: '',
        capabilities: '',
        status: 'customStatus',
        entityType: 'customEntity',
        operationType: 'customOp',
        startTime: 'customStart',
        endTime: 'customEnd',
      });
    });
  });

  describe('edge cases', () => {
    it('should handle undefined criteria in URL gracefully', () => {
      queryString.parse.mockReturnValue({ criteria: undefined });

      const { result } = renderHook(() => useResetAppState(defaultProps));

      act(() => {
        result.current.resetAppState();
      });

      expect(buildSearch).toHaveBeenCalledWith(
        expect.objectContaining({
          criteria: CRITERIA.IDENTIFIER,
        })
      );
    });

    it('should handle null values in filtersTab.logsTab', () => {
      const customFiltersTab = {
        logsTab: [null, null, null, null, null],
      };

      const { result } = renderHook(() => useResetAppState({
        ...defaultProps,
        filtersTab: customFiltersTab,
      }));

      act(() => {
        result.current.resetAppState();
      });

      expect(buildSearch).toHaveBeenCalledWith({
        criteria: CRITERIA.IDENTIFIER,
        identifier: '',
        capabilities: '',
        status: null,
        entityType: null,
        operationType: null,
        startTime: null,
        endTime: null,
      });
    });
  });

  describe('navigation', () => {
    it('should navigate to /bulk-edit with correct pathname', () => {
      const { result } = renderHook(() => useResetAppState(defaultProps));

      act(() => {
        result.current.resetAppState();
      });

      expect(mockHistoryReplace).toHaveBeenCalledWith({
        pathname: '/bulk-edit',
        search: expect.any(String),
      });
    });

    it('should clear identifier and capabilities in search params', () => {
      const { result } = renderHook(() => useResetAppState(defaultProps));

      act(() => {
        result.current.resetAppState();
      });

      expect(buildSearch).toHaveBeenCalledWith(
        expect.objectContaining({
          identifier: '',
          capabilities: '',
        })
      );
    });
  });
});
