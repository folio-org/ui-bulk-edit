declare module '@folio/stripes-acq-components/lib/AcqList/hooks/usePagination' {
    interface UsePaginationResult {
        pagination: {
            limit: number;
            offset: number;
        };
        changePage: () => void;
        refreshPage: () => void;
    }
    export const usePagination: (defaultPagination: object) => UsePaginationResult;
}
