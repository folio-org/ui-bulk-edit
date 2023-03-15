declare module '@folio/stripes-acq-components/lib/AcqList/NoResultsMessage' {
    import React, { ReactNode } from 'react';

    export const NoResultsMessage: React.FunctionComponent<{
        filters?: object,
        isFiltersOpened: boolean,
        isLoading?: boolean,
        notLoadedMessage: ReactNode,
        toggleFilters: () => void,
    }>;
}
