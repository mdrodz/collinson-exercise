import { cleanup, render, screen, waitFor } from '@testing-library/react';
import { useQuery } from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { QueryProvider } from '.';

function QueryConsumer({ queryFn }: { readonly queryFn: () => Promise<string> })
{
    const { data } = useQuery({ queryKey: ['query-provider-test'], queryFn });

    return <div>{data ?? 'loading'}</div>;
}

describe('QueryProvider', () => {
    afterEach(cleanup);

    it('renders its children', () => {
        render(
            <QueryProvider>
                <div>provider content</div>
            </QueryProvider>,
        );

        expect(screen.getByText('provider content')).toBeDefined();
    });

    it('shares cached query data with consumers within the stale time', async () => {
        const queryFn = vi.fn().mockResolvedValue('cached result');

        const { unmount } = render(
            <QueryProvider>
                <QueryConsumer queryFn={queryFn} />
            </QueryProvider>,
        );

        expect(await screen.findByText('cached result')).toBeDefined();
        expect(queryFn).toHaveBeenCalledTimes(1);

        unmount();
        render(
            <QueryProvider>
                <QueryConsumer queryFn={queryFn} />
            </QueryProvider>,
        );

        await waitFor(() => expect(screen.getByText('cached result')).toBeDefined());
        expect(queryFn).toHaveBeenCalledTimes(1);
    });
});
