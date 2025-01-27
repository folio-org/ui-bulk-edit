import { useEffect, useState } from 'react';
import { ERROR_TYPES } from '../constants';

// empty string is used to reset the error type and show both errors and warnings
const getDynamicErrorType = (condition) => (condition ? '' : ERROR_TYPES.ERROR);

export const useErrorType = ({ countOfErrors, countOfWarnings }) => {
  const hasOnlyWarnings = countOfErrors === 0 && countOfWarnings > 0;
  const initialErrorType = getDynamicErrorType(hasOnlyWarnings);

  const [errorType, setErrorType] = useState(initialErrorType);

  const toggleErrorType = () => {
    setErrorType(getDynamicErrorType(!!errorType));
  };

  useEffect(() => {
    setErrorType(initialErrorType);
  }, [initialErrorType]);

  return { errorType, toggleErrorType };
};
