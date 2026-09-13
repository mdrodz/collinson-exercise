import WeatherForecast from '../../domain/wheather/weather-forecast.js';

export const GET_WEATHER_PORT = Symbol('GetWeatherPort');

export interface GetWeatherPort
{
    execute(city: string, country: string): Promise<WeatherForecast>;
}
