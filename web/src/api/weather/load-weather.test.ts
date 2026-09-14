import { afterEach, describe, expect, it, vi } from 'vitest';
import loadWeather from './load-weather';

describe('loadWeather', () => {
    afterEach(() => {
        vi.unstubAllGlobals();
    });

    it('posts the request and returns weather data for the selected location', async () => {
        const mockFetch = vi.fn().mockResolvedValue({
            ok: true,
            json: async () => ({
                data: {
                    weather: {
                        days: [
                            {
                                date: '2026-09-13',
                                activities: [{ activity: 'WALKING', score: 8, label: 'Excellent' }],
                            },
                        ],
                    },
                },
            }),
        });

        vi.stubGlobal('fetch', mockFetch);

        const weather = await loadWeather('Lisbon', 'Portugal');

        expect(mockFetch).toHaveBeenCalledWith(
            'http://localhost:3000/graphql',
            expect.objectContaining({
                method: 'POST',
                headers: expect.objectContaining({
                    'Content-Type': 'application/json',
                    'Accept': 'appliation/json',
                }),
                body: expect.stringContaining('query Weather'),
            }),
        );
        expect(weather).toEqual({
            days: [{
                date: '2026-09-13',
                activities: [{ activity: 'WALKING', score: 8, label: 'Excellent' }],
            }],
        });
    });

    it('throws a user-friendly error when the API responds with a failure', async () => {
        vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false }));

        await expect(loadWeather('Sao Paulo', 'Brazil')).rejects.toThrow('Unable to load this forecast.');
    });
});
