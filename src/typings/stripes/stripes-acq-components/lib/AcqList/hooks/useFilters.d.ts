declare module '@folio/stripes-acq-components/lib/AcqList/hooks/useFilters' {
    interface UseFiltersResult {
        filters: object,
        searchQuery: string,
        applyFilters: (a: unknown, b: unknown) => object,
        applySearch: () => void,
        changeSearch: (a: unknown) => void,
        resetFilters: unknown,
        setFilters: unknown,
        setSearchQuery: unknown
        setSearchIndex: unknown,
        searchIndex: string,
        changeSearchIndex: unknown
    }
    export const useFilters: (resetData: () => void, initialFilters: object) => UseFiltersResult;
}
