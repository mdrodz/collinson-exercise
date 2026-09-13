import { createBrowserRouter, RouterProvider } from "react-router";
import { Root } from "./root";
import Home from "../pages/home";
import NotFound from "../components/NotFound";

const router = createBrowserRouter([
    {
        path:         '/',
        errorElement: <NotFound />,
        element: <Root />,
        children:     [
            {
                path:    '',
                element: <Home />,
            },
        ]
    }
]);

export default function Routes()
{
    return <RouterProvider router={router} />
}
