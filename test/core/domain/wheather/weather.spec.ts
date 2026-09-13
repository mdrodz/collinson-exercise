import Weather, { WeatherProps } from '../../../../src/core/domain/wheather/weather.js';

describe('Weather', () => {
    it('converts times to dates and groups reports by local date', () => {
        const weatherProps: WeatherProps = {
            time: ['2026-01-01T10:00:00Z', '2026-01-01T11:00:00Z', '2026-01-02T10:00:00Z'],
            temperature: [10, 11, 12],
            humidity: [50, 51, 52],
            snowDepth: [0, 0, 0],
            snowfall: [0, 0, 0],
            showers: [0, 0, 0],
            rain: [0, 0, 0],
            precipitationProbability: [10, 20, 30],
            apparentTemperature: [9, 10, 11],
            windSpeed: [5, 6, 7],
            windGusts: [10, 11, 12],
            visibility: [20, 21, 22],
            weatherCode: [0, 1, 2],
            cloudCover: [10, 20, 30],
            uvIndex: [1, 2, 3]
        };
        const weather = new Weather(weatherProps);

        const reportsByDate = weather.getWeatherReportsByDate();

        expect(reportsByDate).toHaveLength(2); // Number of days
        expect(reportsByDate[0][1]).toHaveLength(2); // Weather reports per day
        expect(reportsByDate[0][1][0]).toMatchObject({
            temperature: 10,
            humidity: 50,
            snowDepth: 0,
            snowfall: 0,
            showers: 0,
            rain: 0,
            precipitation: 10,
            apparentTemperature: 9,
            wind: 5,
            windGusts: 10,
            visibility: 20,
            weatherCode: 0,
            cloudCover: 10,
            uvIndex: 1
        });
        expect(reportsByDate[1][1][0]).toMatchObject({
            temperature: 12,
            humidity: 52,
            snowDepth: 0,
            snowfall: 0,
            showers: 0,
            rain: 0,
            precipitation: 30,
            apparentTemperature: 11,
            wind: 7,
            windGusts: 12,
            visibility: 22,
            weatherCode: 2,
            cloudCover: 30,
            uvIndex: 3
        });
    });
});
