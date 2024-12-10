import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';
import { useIntl } from 'react-intl';
import { useMemo } from 'react';
import { OPTIONS, PARAMETERS_KEYS, MOD_INVENTORY_STORAGE } from '../../constants';
import { getMappedAndSortedNotes } from '../../utils/helpers';
import { useErrorMessages } from '../useErrorMessages';


export const HOLDINGS_NOTES_KEY = 'HOLDINGS_NOTES_KEY';

export const useHoldingsNotes = (options = {}) => {
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: HOLDINGS_NOTES_KEY });
  const { formatMessage } = useIntl();
  const { showExternalModuleError } = useErrorMessages();

  const { data, isLoading: isHoldingsNotesLoading } = useQuery(
    {
      queryKey: [namespaceKey],
      cacheTime: Infinity,
      staleTime: Infinity,
      queryFn: () => ky.get('holdings-note-types', { searchParams: { limit: 1000 } }).json(),
      onError: (error) => showExternalModuleError(MOD_INVENTORY_STORAGE, error),
      ...options,
    },
  );

  const holdingsNotes = useMemo(() => getMappedAndSortedNotes({
    notes: data?.holdingsNoteTypes,
    categoryName: formatMessage({ id: 'ui-bulk-edit.category.holdingsNotes' }),
    type: OPTIONS.HOLDINGS_NOTE,
    key: PARAMETERS_KEYS.HOLDINGS_NOTE_TYPE_ID_KEY,
  }), [data?.holdingsNoteTypes, formatMessage]);

  return {
    holdingsNotes,
    isHoldingsNotesLoading,
  };
};
