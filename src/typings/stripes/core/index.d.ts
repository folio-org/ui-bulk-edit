declare module '@folio/stripes/core' {
    import type ky from 'ky';
    import type { Context, FunctionComponent, ReactNode } from 'react';

    export type CalloutContextType = {
        sendCallout: (args: {
            type?: 'success' | 'error' | 'warning' | 'info';
            timeout?: number;
            message: ReactNode;
        }) => void;
    };
    export const CalloutContext: Context<CalloutContextType>;

    export interface StripesType {
        hasPerm: (perm: string) => boolean;
    }

    export function useStripes(): StripesType;
    // eslint-disable-next-line no-undef
    export function useOkapiKy(): typeof ky;
    export const IfPermission: FunctionComponent<{
        perm: string;
        children: ReactNode | ((props: { hasPermission: boolean }) => ReactNode);
    }>;
    export const AppIcon: FunctionComponent<{
        alt?: string;
        app?: string;
        children?: ReactNode
        className?: string;
        icon?: {
            lt: string;
            src: string;
        }
        iconClassName?: string;
        iconAriaHidden?: boolean;
        iconAlignment?: 'center' |'baseline';
        iconKey?: string;
        size?: 'small' | 'medium' | 'large';
        src?: string;
        stripes?: {
            metadata: object;
            icons: object;
        }
        style?: object;
        tag?: string;
    }>;
}
