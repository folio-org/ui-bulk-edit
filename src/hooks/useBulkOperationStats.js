import { useContext, useEffect, useState } from 'react';
import { EDITING_STEPS } from '../constants';
import { RootContext } from '../context/RootContext';

export const useBulkOperationStats = ({ bulkDetails, step }) => {
  const { countOfRecords, setCountOfRecords, visibleColumns } = useContext(RootContext);
  const [countOfErrors, setCountOfErrors] = useState(0);
  const [countOfWarnings, setCountOfWarnings] = useState(0);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const isInitialPreview = step === EDITING_STEPS.UPLOAD;

    const countRecords = isInitialPreview
      ? bulkDetails.matchedNumOfRecords
      : bulkDetails.committedNumOfRecords;

    const countErrors = isInitialPreview
      ? bulkDetails.matchedNumOfErrors
      : bulkDetails.committedNumOfErrors;

    const countWarnings = isInitialPreview
      ? bulkDetails.matchedNumOfWarnings
      : bulkDetails.committedNumOfWarnings;

    setCountOfErrors(countErrors);
    setCountOfWarnings(countWarnings);
    setCountOfRecords(countRecords);
    setTotalCount(isInitialPreview ? bulkDetails.totalNumOfRecords : bulkDetails.matchedNumOfRecords);
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
