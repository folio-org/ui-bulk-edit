declare module '@folio/stripes-acq-components/lib/AcqList/ResetButton' {
    import React, { ReactNode } from 'react';

    export const ResetButton: React.FunctionComponent<{
        disabled?: boolean
        id?: string,
        label?: ReactNode,
        reset: () => void,
    }>;
}
