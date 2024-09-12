import {useNotesEsc} from "./useNoteEsc";
import {OPTIONS, PARAMETERS_KEYS} from "../../constants";

export const useItemNotesEsc = (tenants, type, options = {}) => {
  return useNotesEsc(
      'item-note-types-esc',
      tenants,
      type,
      'ui-bulk-edit.category.itemNotes',
      options,
      'item-note-types',
      'itemNoteTypes',
      OPTIONS.ITEM_NOTE,
      PARAMETERS_KEYS.ITEM_NOTE_TYPE_ID_KEY
  );
};
