declare module '@folio/stripes-acq-components/lib/AcqList/PrevNextPagination' {
    import React from 'react';

    export const PrevNextPagination: React.FunctionComponent<{
        offset?: number,
        limit?: number,
        totalCount?: number,
        disabled?: boolean,
        onChange?: () => void,
    }>;
}
