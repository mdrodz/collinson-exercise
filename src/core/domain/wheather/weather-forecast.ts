import type { DailyActivityRating } from './activity.js';

export default class WeatherForecast
{
    constructor(public readonly days: DailyActivityRating[])
    {
    }
}
