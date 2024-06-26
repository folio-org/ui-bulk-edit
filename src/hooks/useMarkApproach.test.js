import { renderHook, act } from '@testing-library/react-hooks';
import uniqueId from 'lodash/uniqueId';

import {
  getDefaultMarkTemplate,
} from '../components/BulkEditPane/BulkEditListResult/BulkEditMark/helpers';
import { useSearchParams } from './useSearchParams';
import { APPROACHES } from '../constants';
import { useMarkApproach } from './useMarkApproach';
import { markActions } from '../constants/markActions';
import { getMarkFormErrors } from '../components/BulkEditPane/BulkEditListResult/BulkEditMark/validation';


jest.mock('lodash/uniqueId', () => jest.fn());

jest.mock('./useSearchParams', () => ({
  useSearchParams: jest.fn(),
}));

jest.mock('../components/BulkEditPane/BulkEditListResult/BulkEditMark/validation', () => ({
  getMarkFormErrors: jest.fn(),
}));


describe('getDefaultMarkTemplate', () => {
  test('should create a default mark template with given id', () => {
    const id = 'test-id';
    const expectedTemplate = {
      id,
      tag: '',
      ind1: '\\',
      ind2: '\\',
      subfield: '',
      actions: [
        {
          meta: {
            options: markActions(),
            required: true,
          },
          name: '',
          data: []
        },
      ],
      parameters: [],
      subfields: [],
    };

    expect(getDefaultMarkTemplate(id)).toEqual(expectedTemplate);
  });
});

describe('useMarkApproach', () => {
  let setParamMock;

  const mockUniqueId = 'unique-id';

  beforeEach(() => {
    setParamMock = jest.fn();
    useSearchParams.mockReturnValue({ setParam: setParamMock });
    getMarkFormErrors.mockReturnValue(true);
    uniqueId.mockReturnValue(mockUniqueId);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('should initialize with default values', () => {
    const { result } = renderHook(() => useMarkApproach());

    expect(result.current.isMarkLayerOpen).toBe(false);
    expect(result.current.isMarkFieldsValid).toBe(true);
  });

  test('should open mark layer and set param', () => {
    const { result } = renderHook(() => useMarkApproach());

    act(() => {
      result.current.openMarkLayer();
    });

    expect(result.current.isMarkLayerOpen).toBe(true);
    expect(setParamMock).toHaveBeenCalledWith('approach', APPROACHES.MARK);
  });

  test('should close mark layer and reset fields', () => {
    const { result } = renderHook(() => useMarkApproach());

    act(() => {
      result.current.closeMarkLayer();
    });

    expect(result.current.isMarkLayerOpen).toBe(false);
    expect(setParamMock).toHaveBeenCalledWith('approach', null);
  });
});

