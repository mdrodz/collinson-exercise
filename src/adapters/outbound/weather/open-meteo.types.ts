export interface OpenMeteoWeatherResponse
{
    hourly: {
        time: string[];
        temperature_2m: number[];
        relative_humidity_2m: number[];
        snow_depth: number[];
        snowfall: number[];
        showers: number[];
        rain: number[];
        precipitation: number[];
        precipitation_probability: number[];
        apparent_temperature: number[];
        dew_point_2m: number[];
        wind_speed_10m: number[];
        wind_direction_10m: number[];
        wind_gusts_10m: number[];
        visibility: number[];
        weather_code: number[];
        cloud_cover: number[];
        cloud_cover_low: number[];
        cloud_cover_mid: number[];
        cloud_cover_high: number[];
        uv_index: number[];
        uv_index_clear_sky: number[];
    };
}
