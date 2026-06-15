import { renderHook } from '@folio/jest-config-stripes/testing-library/react';

import { useEcsCommon } from './useEcsCommon';
import { useMaterialTypesEcs } from './useMaterialTypesEcs';

jest.mock('./useEcsCommon', () => ({
  useEcsCommon: jest.fn(),
}));

describe('useMaterialTypesEcs', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    useEcsCommon.mockReturnValue({ escData: [], isFetching: false });
  });

  it('calls useEcsCommon with the correct key, url, tenants and options', () => {
    const tenants = ['tenant1', 'tenant2'];
    const options = { enabled: true };

    renderHook(() => useMaterialTypesEcs(tenants, options));

    expect(useEcsCommon).toHaveBeenCalledWith(
      'material-types',
      'material-types?limit=1000',
      tenants,
      expect.any(Function),
      options,
    );
  });

  it('passes an empty object as default options when none are provided', () => {
    renderHook(() => useMaterialTypesEcs(['tenant1']));

    expect(useEcsCommon).toHaveBeenCalledWith(
      'material-types',
      'material-types?limit=1000',
      ['tenant1'],
      expect.any(Function),
      {},
    );
  });

  it('returns escData and isFetching from useEcsCommon', () => {
    const escData = [{ value: '1', label: 'Book (tenant1)', tenant: 'tenant1' }];
    useEcsCommon.mockReturnValue({ escData, isFetching: true });

    const { result } = renderHook(() => useMaterialTypesEcs(['tenant1']));

    expect(result.current.escData).toEqual(escData);
    expect(result.current.isFetching).toBe(true);
  });

  describe('mapResponse callback', () => {
    let capturedMapper;

    beforeEach(() => {
      useEcsCommon.mockImplementation((_key, _url, _tenants, mapper) => {
        capturedMapper = mapper;
        return { escData: [], isFetching: false };
      });

      renderHook(() => useMaterialTypesEcs(['tenant1']));
    });

    it('maps mtypes array appending the tenant name to each type name', () => {
      const tenantData = {
        response: {
          mtypes: [
            { id: '1', name: 'Book', source: 'folio' },
            { id: '2', name: 'Video', source: 'folio' },
          ],
        },
      };

      const result = capturedMapper(tenantData, 'tenant1');

      expect(result).toEqual([
        { id: '1', name: 'Book (tenant1)', source: 'folio', tenantName: 'tenant1' },
        { id: '2', name: 'Video (tenant1)', source: 'folio', tenantName: 'tenant1' },
      ]);
    });

    it('returns undefined when the response contains no mtypes array', () => {
      const result = capturedMapper({ response: {} }, 'tenant1');

      expect(result).toBeUndefined();
    });

    it('returns undefined when the response object is absent', () => {
      const result = capturedMapper({}, 'tenant1');

      expect(result).toBeUndefined();
    });
  });
});
