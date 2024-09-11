import { useQuery } from 'react-query';

import {useNamespace, useStripes} from '@folio/stripes/core';

import { usePublishCoordinator } from '../usePublishCoordinator';
import {getMappedAndSortedNotes} from "../../utils/helpers";
import {OPTIONS, PARAMETERS_KEYS} from "../../constants";
import {useIntl} from "react-intl";
import {useMemo} from "react";

const DEFAULT_DATA = {};

export const useHoldingsNotesEsc = (tenants, type, options = {}) => {
    const [namespace] = useNamespace({key:'holdings-note-types-esc'});
    const { initPublicationRequest } = usePublishCoordinator(namespace);
    const { formatMessage } = useIntl();

    const { data = DEFAULT_DATA, isFetching } = useQuery({
        queryKey: [namespace, tenants, 'holdings-note-types', type],
        queryFn: async () => {
            const { publicationResults } = await initPublicationRequest({
                url: 'holdings-note-types',
                method: 'GET',
                tenants,
            });

            console.log(publicationResults);

            return publicationResults;
        },
        keepPreviousData: true,
        ...options
    });

    const holdingsNotesEsc = useMemo(() => {
        if (!data?.length || isFetching) return [];

        // Обрабатываем каждый tenant и его instanceNoteTypes
        const notes = data?.flatMap(tenantData => {
            const tenantName = tenantData.tenantId;
            return tenantData.response?.holdingsNoteTypes?.map(note => ({
                ...note,
                name: `${note?.name} (${tenantName})`
            }));
        });

        return getMappedAndSortedNotes({
            notes,
            categoryName: formatMessage({ id: 'ui-bulk-edit.category.holdingsNotes' }),
            type: OPTIONS.HOLDINGS_NOTE,
            key: PARAMETERS_KEYS.HOLDINGS_NOTE_TYPE_ID_KEY,
        });
    }, [data, formatMessage, isFetching]);

    return {
        holdingsNotesEsc,
        isFetching,
    };
};
