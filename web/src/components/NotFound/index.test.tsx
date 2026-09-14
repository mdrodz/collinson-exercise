import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { HeaderStatusProvider, useHeaderStatus } from '../../contexts/header-status-provider';
import NotFound from '.';
import { MemoryRouter } from 'react-router';

function StatusDisplay()
{
    const { status, statusTone } = useHeaderStatus();

    return <output>{status} {statusTone}</output>;
}

describe('NotFound', () => {
    afterEach(cleanup);

    it('renders the not-found message and updates the header status', () => {
        const { asFragment } = render(
            <MemoryRouter>
                <HeaderStatusProvider>
                    <NotFound />
                    <StatusDisplay />
                </HeaderStatusProvider>
            </MemoryRouter>
        );

        expect(screen.getByRole('heading').textContent).toContain('This page wandered');
        expect(screen.getByText(/the forecast is still here/i)).toBeDefined();
        expect(screen.getByRole('link', { name: /back to the forecast/i }).getAttribute('href')).toBe('/');
        expect(screen.getByText('page not found alert')).toBeDefined();
        
        expect(asFragment()).toMatchSnapshot();
    });
});
