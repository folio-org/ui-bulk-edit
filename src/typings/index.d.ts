// allow TypeScript to permit importing CSS files
declare module '*.css' {
    export const styles: { [className: string]: string };
}

declare module '@folio/stripes-acq-components' {
    export * from '@folio/stripes-acq-components/lib';
}

declare module '@folio/stripes/components' {
    // eslint-disable-next-line no-undef
    export = STCOM;
}
