import { renderHook, act } from '@testing-library/react-hooks';
import uniqueId from 'lodash/uniqueId';

import {
  getMarcFieldTemplate,
} from '../components/BulkEditPane/BulkEditListResult/BulkEditMarc/helpers';
import { useSearchParams } from './useSearchParams';
import { APPROACHES } from '../constants';
import { useMarcApproach } from './useMarcApproach';
import { getMarcFormErrors } from '../components/BulkEditPane/BulkEditListResult/BulkEditMarc/validation';


jest.mock('lodash/uniqueId', () => jest.fn());

jest.mock('./useSearchParams', () => ({
  useSearchParams: jest.fn(),
}));

jest.mock('../components/BulkEditPane/BulkEditListResult/BulkEditMarc/validation', () => ({
  getMarcFormErrors: jest.fn(),
}));


describe('getDefaultMarcTemplate', () => {
  test('should create a default marc template with given id', () => {
    const id = 'test-id';
    const expectedTemplate = {
      id,
      tag: '',
      ind1: '\\',
      ind2: '\\',
      subfield: '',
      actions: [
        {
          name: '',
          data: []
        },
      ],
      subfields: [],
    };

    expect(getMarcFieldTemplate(id)).toEqual(expectedTemplate);
  });
});

describe('useMarcApproach', () => {
  let setParamMock;

  const mockUniqueId = 'unique-id';

  beforeEach(() => {
    setParamMock = jest.fn();
    useSearchParams.mockReturnValue({ setParam: setParamMock });
    getMarcFormErrors.mockReturnValue(true);
    uniqueId.mockReturnValue(mockUniqueId);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with default values', () => {
    const { result } = renderHook(() => useMarcApproach());

    expect(result.current.isMarcLayerOpen).toBe(false);
  });

  test('should open marc layer and set param', () => {
    const { result } = renderHook(() => useMarcApproach());

    act(() => {
      result.current.openMarcLayer();
    });

    expect(result.current.isMarcLayerOpen).toBe(true);
    expect(setParamMock).toHaveBeenCalledWith('approach', APPROACHES.MARC);
  });

  test('should close marc layer and reset fields', () => {
    const { result } = renderHook(() => useMarcApproach());

    act(() => {
      result.current.closeMarcLayer();
    });

    expect(result.current.isMarcLayerOpen).toBe(false);
    expect(setParamMock).toHaveBeenCalledWith('approach', null);
  });
});

