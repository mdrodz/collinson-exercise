import { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type HeaderStatusTone = 'live' | 'alert';

type HeaderStatus = {
    readonly status: string;
    readonly statusTone: HeaderStatusTone;
    readonly setStatusAndTone: (status: string, statusTone?: HeaderStatusTone) => void;
};

const HeaderStatusContext = createContext<HeaderStatus | undefined>(undefined);

export function HeaderStatusProvider({ children }: { readonly children: React.ReactNode })
{
    const [status, setStatus] = useState('live forecast');
    const [statusTone, setStatusTone] = useState<HeaderStatusTone>('live');

    const setStatusAndTone = useCallback((nextStatus: string, nextStatusTone: HeaderStatusTone = 'live') => {
        setStatus(nextStatus);
        setStatusTone(nextStatusTone);
    }, [setStatus, setStatusTone]);

    const providerValue: HeaderStatus = useMemo(() => ({ status, statusTone, setStatusAndTone }), [status, statusTone, setStatusAndTone]);

    return (
        <HeaderStatusContext.Provider value={providerValue}>
            {children}
        </HeaderStatusContext.Provider>
    );
}

export function useHeaderStatus()
{
    const context = useContext(HeaderStatusContext);
    if (!context) {
        throw new Error('useHeaderStatus must be used within HeaderStatusProvider.');
    }

    return context;
}
