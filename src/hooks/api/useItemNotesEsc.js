import { useNotesEsc } from './useNoteEsc';
import { OPTIONS, PARAMETERS_KEYS } from '../../constants';

const NOTE_ESC = {
  NAMESPACE: 'item-note-types-esc',
  CATEGORY: 'ui-bulk-edit.category.itemNotes',
  URL: 'item-note-types',
  NOTE_KEY: 'itemNoteTypes'
};

export const useItemNotesEsc = (tenants, type, options = {}) => {
  return useNotesEsc(
    NOTE_ESC.NAMESPACE,
    tenants,
    type,
    NOTE_ESC.CATEGORY,
    options,
    NOTE_ESC.URL,
    NOTE_ESC.NOTE_KEY,
    OPTIONS.ITEM_NOTE,
    PARAMETERS_KEYS.ITEM_NOTE_TYPE_ID_KEY
  );
};
