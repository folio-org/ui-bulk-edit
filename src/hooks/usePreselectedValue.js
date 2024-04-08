import { useEffect } from 'react';
import { CONTROL_TYPES } from '../constants';
import { FIELD_VALUE_KEY } from '../components/BulkEditPane/BulkEditListResult/BulkEditInApp/ContentUpdatesForm/helpers';

export const usePreselectedValue = (controlType, duplicateNoteOptions, onChange, actionIndex) => {
  useEffect(() => {
    if (controlType === CONTROL_TYPES.NOTE_DUPLICATE_SELECT) {
      onChange({ actionIndex, value: duplicateNoteOptions[0].value, fieldName: FIELD_VALUE_KEY });
    }
    // we need to do that only on the first render, we are sure that all data are ready to be used.
    // This behavior will be changed after refactoring of this functionality.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
