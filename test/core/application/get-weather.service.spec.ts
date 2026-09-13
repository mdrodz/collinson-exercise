import type { Cache } from 'cache-manager';
import { GetWeatherService } from '../../../src/core/application/get-weather.service.js';
import Coordinate from '../../../src/core/domain/geocoding/coordinate.js';
import Weather from '../../../src/core/domain/wheather/weather.js';
import WeatherForecast from '../../../src/core/domain/wheather/weather-forecast.js';

function createWeather(): Weather
{
    return new Weather({
        time: ['2026-01-01T10:00:00Z'],
        temperature: [20],
        humidity: [50],
        snowDepth: [0],
        snowfall: [0],
        showers: [0],
        rain: [0],
        precipitationProbability: [0],
        apparentTemperature: [20],
        windSpeed: [10],
        windGusts: [10],
        visibility: [20],
        weatherCode: [0],
        cloudCover: [10],
        uvIndex: [3]
    });
}

describe('GetWeatherService', () => {
    it('returns a cached forecast without calling external ports', async () => {
        const cachedForecast = new WeatherForecast([]);
        const cache = {
            get: vi.fn().mockResolvedValue(cachedForecast),
            set: vi.fn()
        } as unknown as Cache;
        const geocoding = { fetchCoordinates: vi.fn() };
        const weather = { fetchWeather: vi.fn() };
        const service = new GetWeatherService(cache, geocoding, weather);

        const result = await service.execute(' London ', ' GB ');

        expect(cache.get).toHaveBeenCalledWith('weather:london:gb');
        expect(result).toBe(cachedForecast);

        expect(geocoding.fetchCoordinates).not.toHaveBeenCalled();
        expect(weather.fetchWeather).not.toHaveBeenCalled();
        expect(cache.set).not.toHaveBeenCalled();
    });

    it('fetches, ranks, and caches a forecast when there is no cache entry', async () => {
        const cache = {
            get: vi.fn().mockResolvedValue(undefined),
            set: vi.fn()
        } as unknown as Cache;
        const geocoding = {
            fetchCoordinates: vi.fn().mockResolvedValue(new Coordinate(51.5, -0.1))
        };
        const weather = { fetchWeather: vi.fn().mockResolvedValue(createWeather()) };
        const service = new GetWeatherService(cache, geocoding, weather);

        const result = await service.execute(' London ', ' GB ');

        expect(cache.get).toHaveBeenCalledWith('weather:london:gb');
        expect(result).toBeInstanceOf(WeatherForecast);
        expect(result.days).toHaveLength(1);
        expect(result.days[0].activities).toHaveLength(4);
        expect(result.days[0].activities[0].score).toBeGreaterThanOrEqual(
            result.days[0].activities[1].score
        );
        expect(geocoding.fetchCoordinates).toHaveBeenCalledWith(' London ', ' GB ');
        expect(weather.fetchWeather).toHaveBeenCalledWith(51.5, -0.1);
        expect(cache.set).toHaveBeenCalledWith('weather:london:gb', result);
    });
});
