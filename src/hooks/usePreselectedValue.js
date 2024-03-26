import { useEffect } from 'react';
import { CONTROL_TYPES } from '../constants';
import { FIELD_VALUE_KEY } from '../components/BulkEditPane/BulkEditListResult/BulkEditInApp/ContentUpdatesForm/helpers';

export const usePreselectedValue = (controlType, duplicateNoteOptions, onChange, actionIndex) => {
  useEffect(() => {
    if (controlType === CONTROL_TYPES.NOTE_DUPLICATE_SELECT) {
      onChange({ actionIndex, value: duplicateNoteOptions[0].value, fieldName: FIELD_VALUE_KEY });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
};
