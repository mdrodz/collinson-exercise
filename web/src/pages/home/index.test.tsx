import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router';
import { HeaderStatusProvider } from '../../contexts/header-status-provider';
import loadWeather from '../../api/weather/load-weather';
import Home from '.';

vi.mock('../../api/weather/load-weather', () => ({
    default: vi.fn(),
}));

describe('Home', () => {
    afterEach(() => {
        cleanup();
        vi.clearAllMocks();
    });

    function renderHome()
    {
        const queryClient = new QueryClient({
            defaultOptions: { queries: { retry: false } },
        });

        return render(
            <MemoryRouter>
                <HeaderStatusProvider>
                    <QueryClientProvider client={queryClient}>
                        <Home />
                    </QueryClientProvider>
                </HeaderStatusProvider>
            </MemoryRouter>
        );
    }

    it('renders the forecast search page', () => {
        vi.mocked(loadWeather).mockResolvedValue({ days: [] });

        const { asFragment } = renderHome();

        expect(screen.getByRole('heading', { name: /weather with a little more clarity/i })).toBeDefined();
        expect(screen.getByRole('button', { name: 'Search forecast' })).toBeDefined();

        expect(asFragment()).toMatchSnapshot();
    });

    it('renders forecast days returned by the API', async () => {
        vi.mocked(loadWeather).mockResolvedValue({
            days: [{
                date: '2026-09-13',
                activities: [{ activity: 'WALKING', score: 8, label: 'Excellent' }],
            }],
        });

        renderHome();

        expect(await screen.findByText('1 days ranked')).toBeDefined();
        expect(screen.getByText('WALKING')).toBeDefined();
        expect(screen.getByText('Excellent')).toBeDefined();
        expect(screen.getByText('8')).toBeDefined();
    });

    it('renders an error when the API request fails', async () => {
        vi.mocked(loadWeather).mockRejectedValue(new Error('Forecast unavailable.'));

        renderHome();

        expect(await screen.findByText('Forecast unavailable.')).toBeDefined();
    });

    it('loads a forecast for a submitted location', async () => {
        vi.mocked(loadWeather).mockImplementation(async (city, country) => ({
            days: [{
                date: city === 'Lisbon' && country === 'Portugal' ? '2026-09-14' : '2026-09-13',
                activities: [],
            }],
        }));

        renderHome();

        const cityInput = screen.getByPlaceholderText('City');
        const countryInput = screen.getByPlaceholderText('Country');
        fireEvent.change(cityInput, { target: { value: 'Lisbon' } });
        fireEvent.change(countryInput, { target: { value: 'Portugal' } });
        fireEvent.submit(screen.getByRole('button', { name: 'Search forecast' }));

        await waitFor(() => expect(screen.getByRole('heading', { name: 'Lisbon, Portugal' })).toBeDefined());
        expect(loadWeather).toHaveBeenLastCalledWith('Lisbon', 'Portugal');
    });
});
