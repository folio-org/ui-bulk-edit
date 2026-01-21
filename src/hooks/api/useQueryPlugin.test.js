import { renderHook } from '@folio/jest-config-stripes/testing-library/react';
import { useOkapiKy } from '@folio/stripes/core';
import { useQueryPlugin } from './useQueryPlugin';

jest.mock('@folio/stripes/core', () => ({
  useOkapiKy: jest.fn(),
}));

describe('useQueryPlugin', () => {
  let mockKy;

  beforeEach(() => {
    mockKy = {
      get: jest.fn(() => ({ json: jest.fn().mockResolvedValue({ data: 'test' }) })),
      post: jest.fn(() => ({ json: jest.fn().mockResolvedValue({ data: 'posted' }) })),
      delete: jest.fn(() => Promise.resolve()),
    };
    useOkapiKy.mockReturnValue(mockKy);
  });

  it('calls entityTypeDataSource with correct endpoint', async () => {
    const { result } = renderHook(() => useQueryPlugin('foo'));
    const data = await result.current.entityTypeDataSource();
    expect(mockKy.get).toHaveBeenCalledWith('entity-types/foo');
    expect(data).toEqual({ data: 'test' });
  });

  it('calls queryDetailsDataSource with correct params', async () => {
    const { result } = renderHook(() => useQueryPlugin('foo'));
    await result.current.queryDetailsDataSource({
      queryId: 'bar',
      includeContent: true,
      offset: 1,
      limit: 2,
    });
    expect(mockKy.get).toHaveBeenCalledWith('query/bar', {
      searchParams: { includeResults: true, offset: 1, limit: 2 },
    });
  });

  it('calls testQueryDataSource with correct body', async () => {
    const { result } = renderHook(() => useQueryPlugin('foo'));
    await result.current.testQueryDataSource({ fqlQuery: { a: 1 } });
    expect(mockKy.post).toHaveBeenCalledWith('query', {
      json: { entityTypeId: 'foo', fqlQuery: JSON.stringify({ a: 1 }) },
    });
  });

  it('calls getParamsSource with correct endpoint', async () => {
    const { result } = renderHook(() => useQueryPlugin('foo'));
    await result.current.getParamsSource({
      entityTypeId: 'foo',
      columnName: 'bar',
      searchValue: 'baz',
    });
    expect(mockKy.get).toHaveBeenCalledWith('entity-types/foo/field-values', {
      searchParams: {
        field: 'bar',
        search: 'baz',
      },
    });
  });

  it('calls getOrganizations with correct params', async () => {
    mockKy.get.mockReturnValue({
      json: jest.fn().mockResolvedValue({ organizations: [{ id: '1', name: 'org1' }] }),
    });
    const { result } = renderHook(() => useQueryPlugin('foo'));
    const orgs = await result.current.getOrganizations(['1'], 'name');
    expect(mockKy.get).toHaveBeenCalledWith('organizations/organizations', {
      searchParams: { query: 'id=="1"', limit: 1 },
    });
    expect(orgs).toEqual([{ value: '1', label: 'org1' }]);
  });

  it('calls cancelQueryDataSource with correct endpoint', async () => {
    const { result } = renderHook(() => useQueryPlugin('foo'));
    await result.current.cancelQueryDataSource({ queryId: 'bar' });
    expect(mockKy.delete).toHaveBeenCalledWith('query/bar');
  });

  it('calls runQueryDataSource with correct body', async () => {
    const { result } = renderHook(() => useQueryPlugin('foo'));
    await result.current.runQueryDataSource({
      queryId: 'bar',
      fqlQuery: { a: 1 },
      userFriendlyQuery: 'q',
    });
    expect(mockKy.post).toHaveBeenCalledWith('bulk-operations/query', {
      json: {
        queryId: 'bar',
        entityTypeId: 'foo',
        fqlQuery: JSON.stringify({ a: 1 }),
        userFriendlyQuery: 'q',
      },
    });
  });
});
