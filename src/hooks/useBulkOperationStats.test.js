import { renderHook } from '@testing-library/react-hooks';
import { EDITING_STEPS } from '../constants';
import { useBulkOperationStats } from './useBulkOperationStats';

jest.mock('react', () => {
  const ActualReact = jest.requireActual('react');
  return {
    ...ActualReact,
    useContext: () => ({
      countOfRecords: 0,
      setCountOfRecords: jest.fn(),
      visibleColumns: [],
    }),
  };
});

describe('useBulkOperationStats', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  test('initial state is set correctly', () => {
    const { result } = renderHook(() => useBulkOperationStats({ bulkDetails: { matchedNumOfRecords: 5, totalNumOfRecords: 10 }, step: EDITING_STEPS.UPLOAD }));

    expect(result.current.countOfRecords).toBe(0);
    expect(result.current.countOfErrors).toBe(undefined);
    expect(result.current.totalCount).toBe(10);
    expect(result.current.visibleColumns).toEqual([]);
  });

  test('state is updated correctly for UPLOAD step', () => {
    const { result, rerender } = renderHook(
      ({ bulkDetails, step }) => useBulkOperationStats({ bulkDetails, step }),
      {
        initialProps: {
          bulkDetails: { matchedNumOfRecords: 5, matchedNumOfErrors: 2, totalNumOfRecords: 10 },
          step: EDITING_STEPS.UPLOAD,
        },
      }
    );

    expect(result.current.countOfRecords).toBe(0);
    expect(result.current.countOfErrors).toBe(2);
    expect(result.current.totalCount).toBe(10);

    rerender({
      bulkDetails: { matchedNumOfRecords: 8, matchedNumOfErrors: 3, totalNumOfRecords: 15 },
      step: EDITING_STEPS.UPLOAD,
    });

    expect(result.current.countOfRecords).toBe(0);
    expect(result.current.countOfErrors).toBe(3);
    expect(result.current.totalCount).toBe(15);
  });

  test('state is updated correctly for COMMIT step', () => {
    const { result, rerender } = renderHook(
      ({ bulkDetails, step }) => useBulkOperationStats({ bulkDetails, step }),
      {
        initialProps: {
          bulkDetails: { matchedNumOfRecords: 5, matchedNumOfErrors: 2, totalNumOfRecords: 10 },
          step: EDITING_STEPS.COMMIT,
        },
      }
    );

    expect(result.current.countOfRecords).toBe(0);
    expect(result.current.countOfErrors).toBe(undefined);
    expect(result.current.totalCount).toBe(5);

    rerender({
      bulkDetails: { committedNumOfRecords: 8, committedNumOfErrors: 3, totalNumOfRecords: 15 },
      step: EDITING_STEPS.COMMIT,
    });

    expect(result.current.countOfRecords).toBe(0);
    expect(result.current.countOfErrors).toBe(3);
  });
});
