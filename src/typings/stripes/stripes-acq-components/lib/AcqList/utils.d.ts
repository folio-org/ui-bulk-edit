declare module '@folio/stripes-acq-components/lib/AcqList/utils' {
    export const buildSearch: (newQueryParams: object, searchString: string) => string;
    export const buildPaginatelessSearch: (searchString: string) => string;
    export const buildFiltersObj: (searchString: string) => object;
    export const buildSortingObj: (searchString: string, defaultSorting: object) => {
        sortingField: string;
        sortingDirection: string;
    };
    export const makeQueryBuilder: (
        searchAllQuery: unknown,
        getSearchQuery: unknown,
        defaultSorting: unknown,
        customFilterMap: unknown,
        customSortMap: unknown
    ) => string;
    export const getFiltersCount: (filters: object) => number;
    export const batchRequest: (
        requestFn: (params: object) => unknown,
        items: unknown[],
        buildQuery: (itemsChunk: unknown[]) => string,
        params: object,
        filterParamName: string
    ) => number;
}
