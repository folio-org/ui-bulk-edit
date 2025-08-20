import { useQuery } from 'react-query';
import { useIntl } from 'react-intl';
import { useMemo } from 'react';

import { useNamespace } from '@folio/stripes/core';

import { getMappedAndSortedNotes } from '../../utils/helpers';
import { PUBLISH_COORDINATOR_STATUSES_METHODS, usePublishCoordinator } from '../usePublishCoordinator';
import { useTenants } from '../../context/TenantsContext';

const DEFAULT_DATA = {};

export const useNotesEcs = ({ namespaceKey, tenants, type, categoryId, url, noteKey, optionType, parameterKey, options = {} }) => {
  const [namespace] = useNamespace({ key: namespaceKey });
  const { initPublicationRequest } = usePublishCoordinator(namespace);
  const { formatMessage } = useIntl();
  const { excludeLocalResults } = useTenants();

  const { data = DEFAULT_DATA, isFetching } = useQuery({
    queryKey: [namespace, tenants, url, type],
    queryFn: async () => {
      const { publicationResults } = await initPublicationRequest({
        url,
        method: PUBLISH_COORDINATOR_STATUSES_METHODS.GET,
        tenants,
      });
      return publicationResults;
    },
    keepPreviousData: true,
    cacheTime: Infinity,
    staleTime: Infinity,
    ...options
  });

  const notesEcs = useMemo(() => {
    if (!data?.length || isFetching) return [];
    const notes = data.flatMap(tenantData => {
      const tenantName = tenants.length ? tenantData.tenantId : null;
      const filteredRecords = excludeLocalResults(tenantData.response?.[noteKey]);
      return filteredRecords?.map(note => ({
        ...note,
        name: `${note.name} (${tenantName})`,
        tenantName
      }));
    });

    return getMappedAndSortedNotes({
      notes,
      categoryName: formatMessage({ id: categoryId }),
      type: optionType,
      key: parameterKey,
    });
  }, [categoryId, data, excludeLocalResults, formatMessage, isFetching, noteKey, optionType, parameterKey, tenants?.length]);

  return {
    notesEcs,
    isFetching,
  };
};
