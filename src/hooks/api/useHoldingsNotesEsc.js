import { useNotesEsc } from './useNoteEsc';
import { OPTIONS, PARAMETERS_KEYS } from '../../constants';

export const useHoldingsNotesEsc = (tenants, type, options = {}) => {
  return useNotesEsc(
    'holdings-note-types-esc',
    tenants,
    type,
    'ui-bulk-edit.category.holdingsNotes',
    options,
    'holdings-note-types',
    'holdingsNoteTypes',
    OPTIONS.HOLDINGS_NOTE,
    PARAMETERS_KEYS.HOLDINGS_NOTE_TYPE_ID_KEY
  );
};
