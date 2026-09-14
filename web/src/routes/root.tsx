import { Outlet, ScrollRestoration } from 'react-router';
import Header from '../components/Header';
import { useHeaderStatus } from '../contexts/HeaderStatusProvider';

export function Root()
{
    const { status, statusTone } = useHeaderStatus();

    return (
        <>
            <Header status={status} statusTone={statusTone} />
            <Outlet />
            <ScrollRestoration />
        </>
    );
}
