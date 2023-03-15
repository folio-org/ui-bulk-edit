declare module '@folio/stripes-acq-components/lib/AcqList/hooks/useLocationSorting' {
    import { History, Location } from 'history';

    export function useLocationSorting(
        location: Location,
        history: History,
        resetData: unknown,
        sortableFields: unknown,
        defaultSorting: unknown
    ): unknown[]
}
