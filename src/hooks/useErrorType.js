import { useState, useEffect, useMemo } from 'react';
import { ERROR_TYPES } from '../constants';

export const useErrorType = ({ countOfErrors, countOfWarnings }) => {
  const hasErrorsOrWarnings = countOfErrors > 0 || countOfWarnings > 0;
  const hasOnlyWarnings = countOfErrors === 0 && countOfWarnings > 0;

  /**
   * Based on this state errorType will be set:
   * - `true`  => show both (represented by an empty string)
   * - `false` => show errors (ERROR_TYPES.ERROR)
   * - `null`  => initial state (no errors or warnings)
   */
  const [showWarnings, setShowWarnings] = useState(null);

  useEffect(() => {
    if (hasOnlyWarnings) {
      setShowWarnings(true);
    } else if (hasErrorsOrWarnings) {
      setShowWarnings(false);
    } else {
      setShowWarnings(null);
    }
  }, [hasOnlyWarnings, hasErrorsOrWarnings]);

  const toggleShowWarnings = () => {
    setShowWarnings(prev => !prev);
  };

  const errorType = useMemo(() => {
    if (showWarnings === null) return null;

    return showWarnings ? '' : ERROR_TYPES.ERROR;
  }, [showWarnings]);

  return {
    errorType,
    hasOnlyWarnings,
    hasErrorsOrWarnings,
    toggleShowWarnings,
  };
};
