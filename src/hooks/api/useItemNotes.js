import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';
import { useIntl } from 'react-intl';
import { useMemo } from 'react';
import { MOD_INVENTORY_STORAGE, OPTIONS, PARAMETERS_KEYS } from '../../constants';
import { getMappedAndSortedNotes } from '../../utils/helpers';
import { useErrorMessages } from '../useErrorMessages';

export const ITEM_NOTES_KEY = 'ITEM_NOTES_KEY';

export const useItemNotes = (options = {}) => {
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: ITEM_NOTES_KEY });
  const { formatMessage } = useIntl();
  const { showExternalModuleError } = useErrorMessages();

  const { data, isLoading: isItemNotesLoading } = useQuery(
    {
      queryKey: [namespaceKey],
      cacheTime: Infinity,
      staleTime: Infinity,
      queryFn: () => ky.get('item-note-types', { searchParams: { limit: 1000 } }).json(),
      onError: (error) => showExternalModuleError(MOD_INVENTORY_STORAGE, error),
      ...options,
    },
  );

  const itemNotes = useMemo(() => getMappedAndSortedNotes({
    notes: data?.itemNoteTypes,
    categoryName: formatMessage({ id: 'ui-bulk-edit.category.itemNotes' }),
    type: OPTIONS.ITEM_NOTE,
    key: PARAMETERS_KEYS.ITEM_NOTE_TYPE_ID_KEY,
  }), [data?.itemNoteTypes, formatMessage]);

  return {
    itemNotes,
    isItemNotesLoading,
  };
};
