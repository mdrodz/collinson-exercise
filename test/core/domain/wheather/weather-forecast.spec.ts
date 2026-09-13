import WeatherForecast from '../../../../src/core/domain/wheather/weather-forecast.js';
import { Activity, ActivityRatingLabel } from '../../../../src/core/domain/wheather/activity.js';

describe('WeatherForecast', () => {
    it('stores the daily activity ratings', () => {
        const days = [{
            date: '01/01/2026',
            activities: [{
                activity: Activity.Skiing,
                score: 90,
                label: ActivityRatingLabel.Excellent
            }]
        }];

        const forecast = new WeatherForecast(days);

        expect(forecast.days).toBe(days);
    });
});
