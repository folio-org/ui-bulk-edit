import { useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';
import { useIntl } from 'react-intl';
import { OPTIONS, PARAMETERS_KEYS } from '../../constants';
import { getMappedAndSortedNotes } from '../../utils/helpers';

export const useItemNotes = (options = {}) => {
  const ky = useOkapiKy();
  const { formatMessage } = useIntl();

  const { data, isLoading: isItemNotesLoading } = useQuery(
    {
      queryKey: 'itemNotes',
      cacheTime: Infinity,
      staleTime: Infinity,
      queryFn: () => ky.get('item-note-types', { searchParams: { limit: 1000 } }).json(),
      ...options,
    },
  );

  const itemNotes = getMappedAndSortedNotes({
    notes: data?.itemNoteTypes,
    categoryName: formatMessage({ id: 'ui-bulk-edit.category.itemNotes' }),
    type: OPTIONS.ITEM_NOTE,
    key: PARAMETERS_KEYS.ITEM_NOTE_TYPE_ID_KEY,
  });

  return {
    itemNotes,
    isItemNotesLoading,
  };
};
