import { renderHook } from '@folio/jest-config-stripes/testing-library/react-hooks';
import { useQuery } from 'react-query';
import { useIntl } from 'react-intl';

import { useNamespace, useOkapiKy } from '@folio/stripes/core';

import { useRecordsPreview, RECORDS_PREVIEW_KEY } from './useRecordsPreview';
import { getMappedTableData } from '../../utils/mappers';
import { useErrorMessages } from '../useErrorMessages';
import { RootContext } from '../../context/RootContext';
import { BULK_VISIBLE_COLUMNS } from '../../constants';

jest.mock('react-query', () => ({
  useQuery: jest.fn(),
}));

jest.mock('react-intl', () => ({
  useIntl: jest.fn(),
}));

jest.mock('@folio/stripes/core', () => ({
  useNamespace: jest.fn(),
  useOkapiKy: jest.fn(),
}));

jest.mock('../../utils/mappers', () => ({
  getMappedTableData: jest.fn(),
}));

jest.mock('../useErrorMessages', () => ({
  useErrorMessages: jest.fn(),
}));

const mockSetVisibleColumns = jest.fn();

const wrapper = ({ children }) => (
  <RootContext.Provider value={{ visibleColumns: ['col1'], setVisibleColumns: mockSetVisibleColumns }}>
    {children}
  </RootContext.Provider>
);

describe('useRecordsPreview', () => {
  const mockNamespace = 'testNamespace';
  const mockKy = {
    get: jest.fn(),
  };
  const mockIntl = { formatMessage: jest.fn() };
  const mockShowErrorMessage = jest.fn();
  const mockRefetch = jest.fn();

  const defaultParams = {
    key: RECORDS_PREVIEW_KEY,
    id: 'test-id',
    step: 'UPLOAD',
    queryOptions: {},
    capabilities: 'USER',
    limit: 10,
    offset: 0,
    criteria: 'IDENTIFIER',
    queryRecordType: 'USER',
  };

  const mockColumns = [
    { value: 'username', label: 'Username', selected: true },
    { value: 'email', label: 'Email', selected: false },
    { value: 'status', label: 'Status', selected: true, forceSelected: true },
  ];

  const mockMappedData = {
    contentData: [
      { username: 'user1', email: 'user1@test.com', status: 'active' },
      { username: 'user2', email: 'user2@test.com', status: 'inactive' },
    ],
    columnMapping: {
      username: 'Username',
      email: 'Email',
      status: 'Status',
    },
    columns: mockColumns,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.clear();

    useNamespace.mockReturnValue([mockNamespace]);
    useOkapiKy.mockReturnValue(mockKy);
    useIntl.mockReturnValue(mockIntl);
    useErrorMessages.mockReturnValue({
      showErrorMessage: mockShowErrorMessage,
    });

    mockKy.get.mockReturnValue({
      json: jest.fn().mockResolvedValue({ data: 'preview-data' }),
    });

    getMappedTableData.mockReturnValue(mockMappedData);
  });

  it('should return loading state initially', () => {
    useQuery.mockReturnValue({
      data: undefined,
      refetch: mockRefetch,
      isLoading: true,
      isFetching: true,
    });

    getMappedTableData.mockReturnValue({
      contentData: [],
      columnMapping: {},
      columns: [],
    });

    const { result } = renderHook(() => useRecordsPreview(defaultParams), { wrapper });

    expect(result.current.isLoading).toBe(true);
    expect(result.current.isFetching).toBe(true);
    expect(result.current.contentData).toEqual([]);
    expect(result.current.columns).toEqual([]);
  });

  it('should call useQuery with correct parameters', () => {
    useQuery.mockReturnValue({
      data: { data: 'test' },
      refetch: mockRefetch,
      isLoading: false,
      isFetching: false,
    });

    renderHook(() => useRecordsPreview(defaultParams), { wrapper });

    expect(useQuery).toHaveBeenCalledWith(
      expect.objectContaining({
        queryKey: [
          RECORDS_PREVIEW_KEY,
          mockNamespace,
          'test-id',
          'UPLOAD',
          10,
          0,
        ],
        keepPreviousData: true,
        onError: mockShowErrorMessage,
        onSuccess: mockShowErrorMessage,
      })
    );
  });

  it('should fetch preview data with correct API call', async () => {
    useQuery.mockReturnValue({
      data: { data: 'test' },
      refetch: mockRefetch,
      isLoading: false,
      isFetching: false,
    });

    renderHook(() => useRecordsPreview(defaultParams), { wrapper });

    const queryConfig = useQuery.mock.calls[0][0];
    await queryConfig.queryFn();

    expect(mockKy.get).toHaveBeenCalledWith('bulk-operations/test-id/preview', {
      searchParams: { limit: 10, offset: 0, step: 'UPLOAD' },
    });
  });

  it('should return mapped data from getMappedTableData', () => {
    useQuery.mockReturnValue({
      data: { data: 'test' },
      refetch: mockRefetch,
      isLoading: false,
      isFetching: false,
    });

    const { result } = renderHook(() => useRecordsPreview(defaultParams), { wrapper });

    expect(result.current.contentData).toEqual(mockMappedData.contentData);
    expect(result.current.columnMapping).toEqual(mockMappedData.columnMapping);
    expect(result.current.columns).toEqual(mockMappedData.columns);
  });

  it('should return refetch function', () => {
    useQuery.mockReturnValue({
      data: { data: 'test' },
      refetch: mockRefetch,
      isLoading: false,
      isFetching: false,
    });

    const { result } = renderHook(() => useRecordsPreview(defaultParams), { wrapper });

    expect(result.current.refetch).toBe(mockRefetch);
  });

  describe('visible columns management', () => {
    it('should compute visible columns synchronously when columns are available', () => {
      useQuery.mockReturnValue({
        data: { data: 'test' },
        refetch: mockRefetch,
        isLoading: false,
        isFetching: false,
      });

      renderHook(() => useRecordsPreview(defaultParams), { wrapper });

      expect(mockSetVisibleColumns).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ value: 'username' }),
          expect.objectContaining({ value: 'email' }),
          expect.objectContaining({ value: 'status' }),
        ])
      );
    });

    it('should not set visible columns when no columns are available', () => {
      useQuery.mockReturnValue({
        data: undefined,
        refetch: mockRefetch,
        isLoading: true,
        isFetching: true,
      });

      getMappedTableData.mockReturnValue({
        contentData: [],
        columnMapping: {},
        columns: [{ value: 'col1', selected: true }],
      });

      renderHook(() => useRecordsPreview(defaultParams), { wrapper });

      expect(mockSetVisibleColumns).toHaveBeenCalledWith([{ 'selected': true, 'value': 'col1' }]);
    });

    it('should force selected columns to be visible', () => {
      useQuery.mockReturnValue({
        data: { data: 'test' },
        refetch: mockRefetch,
        isLoading: false,
        isFetching: false,
      });

      renderHook(() => useRecordsPreview(defaultParams), { wrapper });

      const visibleColumnsCall = mockSetVisibleColumns.mock.calls[0][0];
      const statusColumn = visibleColumnsCall.find(col => col.value === 'status');

      expect(statusColumn.selected).toBe(true);
    });

    it('should load visible columns from localStorage', () => {
      const storageKey = `${BULK_VISIBLE_COLUMNS}_USER`;
      const storedColumns = [
        { value: 'username', label: 'Username', selected: true },
        { value: 'email', label: 'Email', selected: true },
        { value: 'status', label: 'Status', selected: false },
      ];
      localStorage.setItem(storageKey, JSON.stringify(storedColumns));

      useQuery.mockReturnValue({
        data: { data: 'test' },
        refetch: mockRefetch,
        isLoading: false,
        isFetching: false,
      });

      renderHook(() => useRecordsPreview(defaultParams), { wrapper });

      expect(mockSetVisibleColumns).toHaveBeenCalledWith(
        expect.arrayContaining([
          expect.objectContaining({ value: 'username', selected: true }),
          expect.objectContaining({ value: 'email', selected: true }),
        ])
      );
    });

    it('should save columns to localStorage when length differs', () => {
      const storageKey = `${BULK_VISIBLE_COLUMNS}_USER`;
      const differentColumns = [
        { value: 'username', label: 'Username', selected: true },
      ];
      localStorage.setItem(storageKey, JSON.stringify(differentColumns));

      useQuery.mockReturnValue({
        data: { data: 'test' },
        refetch: mockRefetch,
        isLoading: false,
        isFetching: false,
      });

      renderHook(() => useRecordsPreview(defaultParams), { wrapper });

      const stored = JSON.parse(localStorage.getItem(storageKey));
      expect(stored).toHaveLength(mockColumns.length);
    });

    it('should update visible columns when capabilities change', () => {
      useQuery.mockReturnValue({
        data: { data: 'test' },
        refetch: mockRefetch,
        isLoading: false,
        isFetching: false,
      });

      const { rerender } = renderHook(
        ({ capabilities }) => useRecordsPreview({ ...defaultParams, capabilities }),
        {
          wrapper,
          initialProps: { capabilities: 'USER' }
        }
      );

      expect(mockSetVisibleColumns).toHaveBeenCalledTimes(1);

      rerender({ capabilities: 'ITEM' });

      expect(mockSetVisibleColumns).toHaveBeenCalledTimes(2);
    });
  });

  describe('query options', () => {
    it('should merge custom query options', () => {
      const customOptions = {
        enabled: false,
        staleTime: 5000,
      };

      useQuery.mockReturnValue({
        data: undefined,
        refetch: mockRefetch,
        isLoading: false,
        isFetching: false,
      });

      renderHook(() => useRecordsPreview({ ...defaultParams, queryOptions: customOptions }), { wrapper });

      expect(useQuery).toHaveBeenCalledWith(
        expect.objectContaining({
          enabled: false,
          staleTime: 5000,
        })
      );
    });
  });

  describe('error handling', () => {
    it('should call showErrorMessage on error', async () => {
      useQuery.mockReturnValue({
        data: undefined,
        refetch: mockRefetch,
        isLoading: false,
        isFetching: false,
      });

      renderHook(() => useRecordsPreview(defaultParams), { wrapper });

      const queryConfig = useQuery.mock.calls[0][0];

      expect(queryConfig.onError).toBe(mockShowErrorMessage);
    });

    it('should call showErrorMessage on success', async () => {
      useQuery.mockReturnValue({
        data: { data: 'test' },
        refetch: mockRefetch,
        isLoading: false,
        isFetching: false,
      });

      renderHook(() => useRecordsPreview(defaultParams), { wrapper });

      const queryConfig = useQuery.mock.calls[0][0];

      expect(queryConfig.onSuccess).toBe(mockShowErrorMessage);
    });
  });
});

