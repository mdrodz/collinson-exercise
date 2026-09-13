import { OpenMeteoWeatherMapper } from '../../../../src/adapters/outbound/weather/open-meteo-weather.mapper.js';
import type { OpenMeteoWeatherResponse } from '../../../../src/adapters/outbound/weather/open-meteo.types.js';

describe('OpenMeteoWeatherMapper', () => {
    it('maps Open-Meteo hourly fields to the domain model', () => {
        const response = {
            hourly: {
                time: ['2026-01-01T00:00:00Z'],
                temperature_2m: [12],
                relative_humidity_2m: [60],
                snow_depth: [1],
                snowfall: [2],
                showers: [3],
                rain: [4],
                precipitation: [5],
                precipitation_probability: [6],
                apparent_temperature: [7],
                dew_point_2m: [8],
                wind_speed_10m: [9],
                wind_direction_10m: [10],
                wind_gusts_10m: [11],
                visibility: [12],
                weather_code: [13],
                cloud_cover: [14],
                cloud_cover_low: [15],
                cloud_cover_mid: [16],
                cloud_cover_high: [17],
                uv_index: [18],
                uv_index_clear_sky: [19]
            }
        } satisfies OpenMeteoWeatherResponse;

        const weather = OpenMeteoWeatherMapper.toDomain(response);

        const reportsByDate = weather.getWeatherReportsByDate();
        expect(reportsByDate).toHaveLength(1);
        expect(reportsByDate[0][1]).toHaveLength(1);
        expect(reportsByDate[0][1][0]).toMatchObject({
            temperature: 12,
            humidity: 60,
            snowDepth: 1,
            snowfall: 2,
            showers: 3,
            rain: 4,
            precipitation: 6,
            apparentTemperature: 7,
            wind: 9,
            windGusts: 11,
            visibility: 12,
            weatherCode: 13,
            cloudCover: 14,
            uvIndex: 18
        });
    });
});
