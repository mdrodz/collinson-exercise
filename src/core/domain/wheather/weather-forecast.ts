import type { DailyActivityRating } from './activity.js';

export default class WeatherForecast
{
    constructor(readonly days: DailyActivityRating[])
    {
    }
}
