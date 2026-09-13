import { WeatherResolver } from '../../../../../src/adapters/inbound/graphql/resolvers/weather.resolver.js';
import WeatherForecast from '../../../../../src/core/domain/wheather/weather-forecast.js';

describe('WeatherResolver', () => {
    it('delegates weather queries to the application port', async () => {
        const forecast = new WeatherForecast([]);
        const getWeather = { execute: vi.fn().mockResolvedValue(forecast) };
        const resolver = new WeatherResolver(getWeather);

        await expect(resolver.weather('London', 'GB')).resolves.toBe(forecast);
        expect(getWeather.execute).toHaveBeenCalledWith('London', 'GB');
    });
});
