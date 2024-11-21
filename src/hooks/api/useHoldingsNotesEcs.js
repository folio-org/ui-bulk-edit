import { useNotesEsc } from './useNoteEcs';
import { OPTIONS, PARAMETERS_KEYS } from '../../constants';

const NOTE_ESC = {
  NAMESPACE: 'holdings-note-types-esc',
  CATEGORY: 'ui-bulk-edit.category.holdingsNotes',
  URL: 'holdings-note-types?limit=2000',
  NOTE_KEY: 'holdingsNoteTypes'
};

export const useHoldingsNotesEcs = (tenants, type, options = {}) => {
  return useNotesEsc({
    namespaceKey: NOTE_ESC.NAMESPACE,
    tenants,
    type,
    categoryId: NOTE_ESC.CATEGORY,
    options,
    url: NOTE_ESC.URL,
    noteKey: NOTE_ESC.NOTE_KEY,
    optionType: OPTIONS.HOLDINGS_NOTE,
    parameterKey: PARAMETERS_KEYS.HOLDINGS_NOTE_TYPE_ID_KEY
  });
};
