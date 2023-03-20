declare module '@folio/stripes-acq-components/lib/AcqList/ResultsPane' {
    import React, { ReactChildren, ReactNode } from 'react';

    export const ResultsPane: React.FunctionComponent<{
        id?: string,
        children: ReactChildren
        title: ReactNode,
        subTitle: ReactNode,
        width: string,
        isLoading: boolean,
        count: number,
        renderLastMenu: () => unknown,
        toggleFiltersPane: () => unknown,
        filters: object,
        isFiltersOpened: boolean,
        resultsPaneTitleRef: ReactNode | unknown,
        renderActionMenu: () => unknown,
        autosize: boolean,
    }>;
}
