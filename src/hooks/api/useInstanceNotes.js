import { useNamespace, useOkapiKy } from '@folio/stripes/core';
import { useQuery } from 'react-query';
import { useIntl } from 'react-intl';
import { useMemo } from 'react';
import { OPTIONS, PARAMETERS_KEYS } from '../../constants';
import { getMappedAndSortedNotes } from '../../utils/helpers';

export const INSTANCE_NOTES_KEY = 'INSTANCE_NOTES_KEY';

export const useInstanceNotes = (options = {}) => {
  const ky = useOkapiKy();
  const [namespaceKey] = useNamespace({ key: INSTANCE_NOTES_KEY });
  const { formatMessage } = useIntl();

  const { data, isLoading: isInstanceNotesLoading } = useQuery(
    {
      queryKey: [namespaceKey],
      cacheTime: Infinity,
      staleTime: Infinity,
      queryFn: () => ky.get('instance-note-types', { searchParams: { limit: 1000 } }).json(),
      ...options,
    },
  );

  const instanceNotes = useMemo(() => getMappedAndSortedNotes({
    notes: data?.instanceNoteTypes,
    categoryName: formatMessage({ id: 'ui-bulk-edit.category.instanceNotes' }),
    type: OPTIONS.INSTANCE_NOTE,
    key: PARAMETERS_KEYS.INSTANCE_NOTE_TYPE_ID_KEY,
  }), [data?.instanceNoteTypes, formatMessage]);

  return {
    instanceNotes,
    isInstanceNotesLoading,
  };
};
