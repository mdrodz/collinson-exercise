import { Outlet, ScrollRestoration } from "react-router";


export function Root()
{
    return (
        <>
            <Outlet />
            <ScrollRestoration />
        </>
    );
};
