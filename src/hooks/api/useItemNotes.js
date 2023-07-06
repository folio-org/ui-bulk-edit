import { useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';
import { OPTIONS, PARAMETERS_KEYS } from '../../constants';

export const useItemNotes = () => {
  const ky = useOkapiKy();

  const { data, isLoading: usItemNotesLoading } = useQuery(
    {
      queryKey: 'itemNotes',
      queryFn: () => ky.get('item-note-types').json(),
    },
  );

  const mappedNotes = data?.itemNoteTypes?.map(type => ({
    label: type.name,
    value: type.id,
    type: OPTIONS.ITEM_NOTE,
    parameters: [{
      key: PARAMETERS_KEYS.ITEM_NOTE_TYPE_ID_KEY,
      value: type.id,
    }],
    disabled: false,
  })) || [];

  const itemNotes = mappedNotes.sort((a, b) => a.label.localeCompare(b.label));

  return {
    itemNotes,
    usItemNotesLoading,
  };
};
