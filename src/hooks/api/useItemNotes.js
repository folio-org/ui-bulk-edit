import { useQuery } from 'react-query';
import { useIntl } from 'react-intl';
import { useMemo } from 'react';

import { useNamespace, useOkapiKy, useStripes } from '@folio/stripes/core';

import { OPTIONS, PARAMETERS_KEYS } from '../../constants';
import { getMappedAndSortedNotes } from '../../utils/helpers';
import { useErrorMessages } from '../useErrorMessages';


export const ITEM_NOTES_KEY = 'ITEM_NOTES_KEY';

export const useItemNotes = (options = {}) => {
  const ky = useOkapiKy();
  const stripes = useStripes();
  const [namespaceKey] = useNamespace({ key: ITEM_NOTES_KEY });
  const { formatMessage } = useIntl();
  const path = 'item-note-types';
  const { showExternalModuleError } = useErrorMessages({ path });

  const { data, isLoading: isItemNotesLoading } = useQuery(
    {
      queryKey: [namespaceKey],
      cacheTime: Infinity,
      staleTime: Infinity,
      queryFn: () => ky.get(path, { searchParams: { limit: stripes.config.maxUnpagedResourceCount } }).json(),
      onError: showExternalModuleError,
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
