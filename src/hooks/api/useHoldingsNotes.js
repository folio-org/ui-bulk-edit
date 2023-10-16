import { useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';
import { useIntl } from 'react-intl';
import { OPTIONS, PARAMETERS_KEYS } from '../../constants';
import { getMappedAndSortedNotes } from '../../utils/helpers';

export const useHoldingsNotes = (options = {}) => {
  const ky = useOkapiKy();
  const { formatMessage } = useIntl();

  const { data, isLoading: isHoldingsNotesLoading } = useQuery(
    {
      queryKey: 'holdingsNotes',
      cacheTime: Infinity,
      staleTime: Infinity,
      queryFn: () => ky.get('holdings-note-types').json(),
      ...options,
    },
  );

  const holdingsNotes = getMappedAndSortedNotes({
    notes: data?.holdingsNoteTypes,
    categoryName: formatMessage({ id: 'ui-bulk-edit.category.holdingNotes' }),
    type: OPTIONS.HOLDINGS_NOTE,
    key: PARAMETERS_KEYS.HOLDINGS_NOTE_TYPE_ID_KEY,
  });

  return {
    holdingsNotes,
    isHoldingsNotesLoading,
  };
};
