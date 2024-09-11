import { useQuery } from 'react-query';
import { useIntl } from 'react-intl';
import { useMemo } from 'react';

import { useNamespace } from '@folio/stripes/core';

import { usePublishCoordinator } from '../usePublishCoordinator';
import { getMappedAndSortedNotes } from '../../utils/helpers';
import { OPTIONS, PARAMETERS_KEYS } from '../../constants';

const DEFAULT_DATA = {};

export const useItemNotesEsc = (tenants, type, options = {}) => {
  const [namespace] = useNamespace({ key:'item-note-types-esc' });
  const { initPublicationRequest } = usePublishCoordinator(namespace);
  const { formatMessage } = useIntl();

  const { data = DEFAULT_DATA, isFetching } = useQuery({
    queryKey: [namespace, tenants, 'item-note-types', type],
    queryFn: async () => {
      const { publicationResults } = await initPublicationRequest({
        url: 'item-note-types',
        method: 'GET',
        tenants,
      });

      return publicationResults;
    },
    keepPreviousData: true,
    ...options
  });

  const itemsNotes = useMemo(() => {
    if (!data?.length || isFetching) return [];

    // Обрабатываем каждый tenant и его instanceNoteTypes
    const notes = data?.flatMap(tenantData => {
      const tenantName = tenantData.tenantId;
      return tenantData.response?.itemNoteTypes?.map(note => ({
        ...note,
        name: `${note.name} (${tenantName})`
      }));
    });

    return getMappedAndSortedNotes({
      notes,
      categoryName: formatMessage({ id: 'ui-bulk-edit.category.itemNotes' }),
      type: OPTIONS.ITEM_NOTE,
      key: PARAMETERS_KEYS.ITEM_NOTE_TYPE_ID_KEY,
    });
  }, [data, formatMessage, isFetching]);

  return {
    itemsNotes,
    isFetching,
  };
};
