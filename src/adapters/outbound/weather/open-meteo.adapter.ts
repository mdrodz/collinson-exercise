import { Injectable } from "@nestjs/common";
import { WeatherPort } from "../../../core/ports/outbound/weather.port.js";
import Weather from "../../../core/domain/wheather/weather.js";
import { URLSearchParams } from "node:url";
import { OpenMeteoWeatherResponse } from "./open-meteo.types.js";
import { OpenMeteoWeatherMapper } from "./open-meteo-weather.mapper.js";

@Injectable()
export class OpenMeteoWeatherAdapter implements WeatherPort
{
    async fetchWeather(latitude: number, longitude: number): Promise<Weather>
    {
        const parameters = [
            "temperature_2m",
            "relative_humidity_2m",
            "snow_depth",
            "snowfall",
            "showers",
            "rain",
            "precipitation",
            "precipitation_probability",
            "apparent_temperature",
            "dew_point_2m",
            "wind_speed_10m",
            "wind_direction_10m",
            "wind_gusts_10m",
            "visibility",
            "weather_code",
            "cloud_cover",
            "cloud_cover_low",
            "cloud_cover_mid",
            "cloud_cover_high",
            "uv_index",
            "uv_index_clear_sky"
        ];

        const query = new URLSearchParams({
            latitude: latitude.toString(),
            longitude: longitude.toString(),
            hourly: parameters.join(",")
        });
        
        const response = await fetch(`https://api.open-meteo.com/v1/forecast?${query.toString()}`);
        if (!response.ok) {
            throw new Error(`Failed to fetch weather data: ${response.status} ${response.statusText}`);
        }

        const data: OpenMeteoWeatherResponse = await response.json();
        
        return OpenMeteoWeatherMapper.toDomain(data);
    }
}
