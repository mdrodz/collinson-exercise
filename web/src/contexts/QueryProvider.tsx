import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const FIFTEEN_MINUTES_IN_MILLISECONDS = 1000 * 60 * 10;
const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: FIFTEEN_MINUTES_IN_MILLISECONDS
        }
    }
});

export type QueryClientProviderPropsType = {
    readonly children?: React.ReactNode
};

export function QueryProvider({ children }: QueryClientProviderPropsType)
{
    return (
        <QueryClientProvider client={queryClient}>
            {children}
        </QueryClientProvider>
    );
}
