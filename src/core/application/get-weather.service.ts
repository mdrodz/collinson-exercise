import { Inject, Injectable } from '@nestjs/common';
import type Weather from '../domain/wheather/weather.js';
import type { WeatherReport } from '../domain/wheather/weather.js';
import { Activity, ActivityRatingLabel, type ActivityRating, type DailyActivityRating } from '../domain/wheather/activity.js';
import WeatherForecast from '../domain/wheather/weather-forecast.js';
import { GEOCODING_PORT } from '../ports/outbound/geocoding.port.js';
import type { GeocodingPort } from '../ports/outbound/geocoding.port.js';
import { WEATHER_PORT } from '../ports/outbound/weather.port.js';
import type { WeatherPort } from '../ports/outbound/weather.port.js';
import type { GetWeatherPort } from '../ports/inbound/get-weather.port.js';

@Injectable()
export class GetWeatherService implements GetWeatherPort
{
    constructor(
        @Inject(GEOCODING_PORT) private readonly geocoding: GeocodingPort,
        @Inject(WEATHER_PORT) private readonly weather: WeatherPort
    )
    {
    }

    async execute(city: string, country: string): Promise<WeatherForecast>
    {
        const coordinate = await this.geocoding.fetchCoordinates(city, country);

        const weather = await this.weather.fetchWeather(
            coordinate.getLatitude(),
            coordinate.getLongitude()
        );

        return new WeatherForecast(this.rankDays(weather));
    }

    private rankDays(weather: Weather): DailyActivityRating[]
    {
        return weather.getWeatherReportsByDate().map(([date, reports]) => {
            const ratings = [
                this.rate(Activity.Skiing, reports),
                this.rate(Activity.Surfing, reports),
                this.rate(Activity.OutdoorSightseeing, reports),
                this.rate(Activity.IndoorSightseeing, reports)
            ];

            return {
                date,
                activities: ratings.toSorted((left, right) => right.score - left.score)
            };
        });
    }

    private rate(activity: Activity, reports: WeatherReport[]): ActivityRating
    {
        const {
            apparentTemperature,
            humidity,
            precipitation,
            rain,
            showers,
            wind,
            windGusts,
            visibility,
            snowfall,
            snowDepth,
            cloudCover,
            uvIndex,
            weatherCode
        } = reports.reduce((sum, report) => {
            return {
                apparentTemperature: sum.apparentTemperature + report.apparentTemperature / reports.length,
                humidity: sum.humidity + report.humidity / reports.length,
                precipitation: sum.precipitation + report.precipitation / reports.length,
                rain: sum.rain + report.rain / reports.length,
                showers: sum.showers + report.showers / reports.length,
                wind: sum.wind + report.wind / reports.length,
                windGusts: sum.windGusts + report.windGusts / reports.length,
                visibility: sum.visibility + report.visibility / reports.length,
                snowfall: sum.snowfall + report.snowfall / reports.length,
                snowDepth: sum.snowDepth + report.snowDepth / reports.length,
                cloudCover: sum.cloudCover + report.cloudCover / reports.length,
                uvIndex: sum.uvIndex + report.uvIndex / reports.length,
                weatherCode: sum.weatherCode + report.weatherCode / reports.length
            };
        }, {
            apparentTemperature: 0,
            humidity: 0,
            precipitation: 0,
            rain: 0,
            showers: 0,
            wind: 0,
            windGusts: 0,
            visibility: 0,
            snowfall: 0,
            snowDepth: 0,
            cloudCover: 0,
            uvIndex: 0,
            weatherCode: 0
        });

        let score: number;

        switch (activity) {
            case Activity.Skiing:
                score = this.score(
                    [this.rangeScore(snowfall + snowDepth * 100, 30, 200), 10],
                    [this.rangeScore(apparentTemperature, -8, 2), 3],
                    [this.inverseScore(precipitation, 70), 2],
                    [this.inverseScore(windGusts, 45), 2],
                    [this.rangeScore(visibility, 5, 30), 1],
                    [this.weatherConditionScore(weatherCode), 1]
                );
                break;
            case Activity.Surfing:
                score = this.score(
                    [this.rangeScore(wind, 12, 35), 4],
                    [this.inverseScore(windGusts, 55), 2],
                    [this.inverseScore(precipitation, 80), 1],
                    [this.rangeScore(apparentTemperature, 12, 30), 2],
                    [this.inverseScore(cloudCover, 100), 1],
                    [this.weatherConditionScore(weatherCode), 1]
                );
                break;
            case Activity.OutdoorSightseeing:
                score = this.score(
                    [this.rangeScore(apparentTemperature, 12, 26), 3],
                    [this.inverseScore(precipitation, 35), 3],
                    [this.inverseScore(rain + showers, 10), 2],
                    [this.inverseScore(windGusts, 30), 2],
                    [this.rangeScore(visibility, 8, 30), 2],
                    [this.inverseScore(cloudCover, 100), 1],
                    [this.inverseScore(uvIndex, 10), 1],
                    [this.rangeScore(humidity, 30, 75), 1],
                    [this.weatherConditionScore(weatherCode), 2]
                );
                break;
            case Activity.IndoorSightseeing:
                score = this.score(
                    [this.rangeScore(apparentTemperature, 8, 28), 1],
                    [this.rangeScore(precipitation, 35, 100), 4],
                    [this.rangeScore(rain + showers, 2, 20), 3],
                    [this.inverseScore(windGusts, 50), 2],
                    [this.rangeScore(visibility, 0, 15), 1],
                    [this.rangeScore(cloudCover, 60, 100), 2],
                    [this.inverseScore(this.weatherConditionScore(weatherCode), 100), 1]
                );
                break;
            default:
                throw new Error(`Unknown activity: ${activity}`);
        }

        return {
            activity,
            score,
            label: this.label(score)
        };
    }

    private score(...values: [number, number][]): number
    {
        const totalWeight = values.reduce((sum, [, weight]) => sum + weight, 0);
        const weightedAverage = values.reduce(
            (sum, [value, weight]) => sum + value * weight,
            0
        ) / totalWeight;

        return Math.round(weightedAverage);
    }

    private rangeScore(value: number, idealMin: number, idealMax: number): number
    {
        if (value >= idealMin && value <= idealMax) {
            return 100;
        }

        const distance = value < idealMin ? idealMin - value : value - idealMax;

        return Math.max(0, 100 - distance * 10);
    }

    private inverseScore(value: number, maximum: number): number
    {
        const distanceFromPerfect = Math.min(100, 100 - (value / maximum) * 100);

        return Math.max(0, distanceFromPerfect);
    }

    private weatherConditionScore(weatherCode: number): number
    {
        if (weatherCode === 0) {
            return 100;
        }

        if (weatherCode <= 3) {
            return 90;
        }

        if (weatherCode <= 48) {
            return 65;
        }

        if (weatherCode <= 82) {
            return 40;
        }

        if (weatherCode <= 86) {
            return 25;
        }

        return 10;
    }

    private label(score: number): ActivityRatingLabel
    {
        if (score >= 80) {
            return ActivityRatingLabel.Excellent;
        }

        if (score >= 60) {
            return ActivityRatingLabel.Good;
        }

        if (score >= 40) {
            return ActivityRatingLabel.Fair;
        }

        return ActivityRatingLabel.Poor;
    }
}
