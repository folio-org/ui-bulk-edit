import { useQuery } from 'react-query';
import { useIntl } from 'react-intl';
import { useMemo } from 'react';

import { useNamespace, useOkapiKy } from '@folio/stripes/core';

import { OPTIONS, PARAMETERS_KEYS } from '../../constants';
import { getMappedAndSortedNotes } from '../../utils/helpers';
import { useErrorMessages } from '../useErrorMessages';


export const HOLDINGS_NOTES_KEY = 'HOLDINGS_NOTES_KEY';

export const useHoldingsNotes = (options = {}) => {
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: HOLDINGS_NOTES_KEY });
  const { formatMessage } = useIntl();
  const path = 'holdings-note-types';
  const { showExternalModuleError } = useErrorMessages({ path });

  const { data, isLoading: isHoldingsNotesLoading } = useQuery(
    {
      queryKey: [namespaceKey],
      cacheTime: Infinity,
      staleTime: Infinity,
      queryFn: () => ky.get(path, { searchParams: { limit: 1000 } }).json(),
      onError: showExternalModuleError,
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
