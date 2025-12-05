import { useContext, useEffect, useState } from 'react';
import { RootContext } from '../context/RootContext';
import { getBulkOperationStatsByStep } from '../components/BulkEditPane/BulkEditListResult/PreviewLayout/helpers';

export const useBulkOperationStats = ({ bulkDetails, step }) => {
  const { countOfRecords, setCountOfRecords, visibleColumns } = useContext(RootContext);
  const [countOfErrors, setCountOfErrors] = useState(0);
  const [countOfWarnings, setCountOfWarnings] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const {
      countOfRecords: countRecords,
      countOfWarnings: countWarnings,
      countOfErrors: countErrors,
      totalCount: countTotal,
    } = getBulkOperationStatsByStep(bulkDetails, step);

    setCountOfErrors(countErrors);
    setCountOfWarnings(countWarnings);
    setCountOfRecords(countRecords);
    setTotalCount(countTotal);
  }, [
    bulkDetails,
    step,
    setCountOfErrors,
    setCountOfRecords,
    setTotalCount
  ]);

  return {
    countOfRecords,
    countOfErrors,
    countOfWarnings,
    totalCount,
    visibleColumns,
  };
};
