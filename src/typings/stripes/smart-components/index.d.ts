declare module '@folio/stripes/smart-components' {
    import React, { ReactNode } from 'react';

    export const CheckboxFilter: React.FunctionComponent<{
        dataOptions?: {
            disabled: boolean,
            label: ReactNode,
            readOnly: boolean,
            value: (string|number)[],
        };
        name: string,
        onChange: () => void,
        selectedValues?: (string|number)[],
    }>;
    export const LocationLookup: React.FunctionComponent<{
        disabled?: boolean,
        isTemporaryLocation?: boolean,
        label?: ReactNode,
        marginBottom0?: boolean,
        onLocationSelected: () => void,
        stripes: {
            connect: () => void
        }
    }>;
    export const LocationSelection: React.FunctionComponent<{
        name?: string,
        placeholder?: string,
        stripes?: {
            connect: () => void,
        }
    }>;
    export const DateRangeFilter: React.FunctionComponent<{
        dateFormat?: string;
        focusRef: () => void;
        makeFilterString?: () => void;
        name?: string;
        onChange?: () => void;
        placement?: string;
        selectedValues: object;
    }>;
}
