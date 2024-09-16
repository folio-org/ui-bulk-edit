import { useNotesEsc } from './useNoteEsc';
import { OPTIONS, PARAMETERS_KEYS } from '../../constants';

const NOTE_ESC = {
  NAMESPACE: 'holdings-note-types-esc',
  CATEGORY: 'ui-bulk-edit.category.holdingsNotes',
  URL: 'holdings-note-types',
  NOTE_KEY: 'holdingsNoteTypes'
};

export const useHoldingsNotesEsc = (tenants, type, options = {}) => {
  return useNotesEsc(
    NOTE_ESC.NAMESPACE,
    tenants,
    type,
    NOTE_ESC.CATEGORY,
    options,
    NOTE_ESC.URL,
    NOTE_ESC.NOTE_KEY,
    OPTIONS.HOLDINGS_NOTE,
    PARAMETERS_KEYS.HOLDINGS_NOTE_TYPE_ID_KEY
  );
};
