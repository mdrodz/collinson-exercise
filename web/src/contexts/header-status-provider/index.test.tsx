import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it } from 'vitest';
import { HeaderStatusProvider, useHeaderStatus } from '.';



function StatusConsumer()
{
    const { status, statusTone, setStatusAndTone } = useHeaderStatus();

    return (
        <>
            <div>{status}</div>
            <div>{statusTone}</div>
            <button type="button" onClick={() => setStatusAndTone('forecast unavailable', 'alert')}>
                update status
            </button>
        </>
    );
}

describe('HeaderStatusProvider', () => {
    afterEach(cleanup);

    it('provides the default status and updates it when requested', async () => {
        render(
            <HeaderStatusProvider>
                <StatusConsumer />
            </HeaderStatusProvider>,
        );

        expect(screen.getByText('live forecast')).toBeDefined();
        expect(screen.getByText('live')).toBeDefined();

        fireEvent.click(screen.getByRole('button', { name: /update status/i }));

        expect(await screen.findByText('forecast unavailable')).toBeDefined();
        expect(await screen.findByText('alert')).toBeDefined();
    });
});
