import { createBrowserRouter, RouterProvider } from "react-router";
import { Root } from "./root";
import Home from "../pages/home";
import NotFound from "../components/NotFound";
import ErrorElement from "../components/ErrorElement";

const router = createBrowserRouter([
    {
        path:         '/',
        errorElement: <ErrorElement />,
        element: <Root />,
        children:     [
            {
                path:    '',
                element: <Home />,
            },
            {
                path: '*',
                element: <NotFound />,
            }
        ]
    }
]);

export default function Routes()
{
    return <RouterProvider router={router} />
}
