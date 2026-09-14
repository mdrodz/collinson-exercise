import { cleanup, render, screen } from '@testing-library/react';
import { createMemoryRouter, RouterProvider } from 'react-router';
import { afterEach, describe, expect, it } from 'vitest';
import { HeaderStatusProvider } from '../../contexts/header-status-provider';
import { Root } from '.';

describe('Root', () => {
    afterEach(cleanup);

    it('renders the header and the nested route content', () => {
        const router = createMemoryRouter([
            {
                path: '/',
                element: <Root />,
                children: [
                    {
                        index: true,
                        element: <div>Forecast page</div>,
                    },
                ],
            },
        ], { initialEntries: ['/'] });

        render(
            <HeaderStatusProvider>
                <RouterProvider router={router} />
            </HeaderStatusProvider>
        );

        expect(screen.getByRole('link', { name: /daybound application/i })).toBeDefined();
        expect(screen.getByText('live forecast')).toBeDefined();
        expect(screen.getByText('Forecast page')).toBeDefined();
    });
});
