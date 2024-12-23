import { useNotesEcs } from './useNoteEcs';
import { OPTIONS, PARAMETERS_KEYS } from '../../constants';

const NOTE_ESC = {
  NAMESPACE: 'item-note-types-esc',
  CATEGORY: 'ui-bulk-edit.category.itemNotes',
  URL: 'item-note-types?limit=2000',
  NOTE_KEY: 'itemNoteTypes'
};

export const useItemNotesEcs = (tenants, type, options = {}) => {
  return useNotesEcs({
    namespaceKey: NOTE_ESC.NAMESPACE,
    tenants,
    type,
    categoryId: NOTE_ESC.CATEGORY,
    options,
    url: NOTE_ESC.URL,
    noteKey: NOTE_ESC.NOTE_KEY,
    optionType: OPTIONS.ITEM_NOTE,
    parameterKey: PARAMETERS_KEYS.ITEM_NOTE_TYPE_ID_KEY
  });
};
