import { useEffect } from 'react';
import { ACTIONS, OPTIONS } from '../constants';
import { getActionIndex } from '../components/BulkEditPane/BulkEditListResult/BulkEditInApp/helpers';

/**
 * Filters out STAFF_SUPPRESS and SUPPRESS_FROM_DISCOVERY field options from the fields array
 * when the SET_TO_TRUE action for SET_RECORDS_FOR_DELETE is present.
 *
 * @param {Array} fields - Array of field objects to be filtered.
 * @param {Function} setFields - Function to update the filtered fields array.
 */
export const useFilterFields = (fields, setFields) => {
  // Find the index of the SET_TO_TRUE action for SET_RECORDS_FOR_DELETE
  const setToTrueIndex = getActionIndex(fields, OPTIONS.SET_RECORDS_FOR_DELETE, ACTIONS.SET_TO_TRUE);

  useEffect(() => {
    // If the action is present, filter out STAFF_SUPPRESS and SUPPRESS_FROM_DISCOVERY options
    if (setToTrueIndex !== -1) {
      setFields(prevFields => prevFields.filter(field => ![OPTIONS.STAFF_SUPPRESS, OPTIONS.SUPPRESS_FROM_DISCOVERY].includes(field.option)));
    }
  }, [setToTrueIndex, setFields]);
};
