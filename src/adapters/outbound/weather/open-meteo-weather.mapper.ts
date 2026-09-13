import Weather, { WeatherProps } from "../../../core/domain/wheather/weather.js";
import { OpenMeteoWeatherResponse } from "./open-meteo.types.js";

export class OpenMeteoWeatherMapper
{
    static toDomain(response: OpenMeteoWeatherResponse): Weather
    {
        const { hourly } = response;
        const props: WeatherProps = {
            time: hourly.time,
            temperature: hourly.temperature_2m,
            humidity: hourly.relative_humidity_2m,
            snowDepth: hourly.snow_depth,
            snowfall: hourly.snowfall,
            showers: hourly.showers,
            rain: hourly.rain,
            precipitationProbability: hourly.precipitation_probability,
            apparentTemperature: hourly.apparent_temperature,
            windSpeed: hourly.wind_speed_10m,
            windGusts: hourly.wind_gusts_10m,
            visibility: hourly.visibility,
            weatherCode: hourly.weather_code,
            cloudCover: hourly.cloud_cover,
            uvIndex: hourly.uv_index
        };

        return new Weather(props);
    }
}
