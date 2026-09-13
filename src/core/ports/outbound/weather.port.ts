import Weather from "../../domain/wheather/weather.js";

export const WEATHER_PORT = Symbol('WeatherPort');

export interface WeatherPort
{
    fetchWeather(latitude: number, longitude: number): Promise<Weather>;
}
