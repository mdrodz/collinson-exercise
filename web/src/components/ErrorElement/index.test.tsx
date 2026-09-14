import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { HeaderStatusProvider, useHeaderStatus } from '../../contexts/header-status-provider';
import ErrorElement from '.';
import { MemoryRouter } from 'react-router';

function StatusDisplay()
{
    const { status, statusTone } = useHeaderStatus();

    return <output>{status} {statusTone}</output>;
}

describe('ErrorElement', () => {
    afterEach(cleanup);

    it('renders the recovery message and updates the header status', async () => {
        const { asFragment } = render(
            <MemoryRouter>
                <HeaderStatusProvider>
                    <ErrorElement />
                    <StatusDisplay />
                </HeaderStatusProvider>
            </MemoryRouter>
        );

        expect(await screen.findByText(/something unexpected happened/i)).toBeDefined();
        expect((await screen.findByRole('link', { name: /back to the forecast/i })).getAttribute('href')).toBe('/');
        expect(await screen.findByText('system pause alert')).toBeDefined();

        expect(asFragment()).toMatchSnapshot();
    });
});
