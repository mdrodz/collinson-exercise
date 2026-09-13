import { OpenMeteoGeocodingAdapter } from '../../../../src/adapters/outbound/geocoding/open-meteo.adapter.js';

describe('OpenMeteoGeocodingAdapter', () => {
    afterEach(() => vi.restoreAllMocks());

    it('fetches and maps the first coordinate result', async () => {
        const fetchMock = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
            new Response(JSON.stringify({ results: [{ latitude: 51.5, longitude: -0.1 }] }), {
                status: 200,
                headers: { 'content-type': 'application/json' }
            })
        );

        const coordinate = await new OpenMeteoGeocodingAdapter().fetchCoordinates('London', 'GB');

        expect(coordinate.getLatitude()).toBe(51.5);
        expect(coordinate.getLongitude()).toBe(-0.1);
        expect(fetchMock).toHaveBeenCalledWith(expect.stringContaining('name=London%2CGB'));
    });

    it('throws when the API responds with an error', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(null, {
            status: 503,
            statusText: 'Unavailable'
        }));

        await expect(new OpenMeteoGeocodingAdapter().fetchCoordinates('London', 'GB'))
            .rejects.toThrow('Failed to fetch coordinates: 503 Unavailable');
    });

    it('throws when no result is returned', async () => {
        vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify({ results: [] }), {
            status: 200
        }));

        await expect(new OpenMeteoGeocodingAdapter().fetchCoordinates('Unknown', 'ZZ'))
            .rejects.toThrow('No coordinates found for city: Unknown, country: ZZ');
    });
});
