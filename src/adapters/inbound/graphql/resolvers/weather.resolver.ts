import { Args, Query, Resolver } from '@nestjs/graphql';
import { Inject } from '@nestjs/common';
import type WeatherForecast from '../../../../core/domain/wheather/weather-forecast.js';
import { GET_WEATHER_PORT, type GetWeatherPort } from '../../../../core/ports/inbound/get-weather.port.js';
import { WeatherType } from '../types/weather.type.js';

@Resolver(() => WeatherType)
export class WeatherResolver
{
    constructor(
        @Inject(GET_WEATHER_PORT) private readonly getWeather: GetWeatherPort
    )
    {
    }

    @Query(() => WeatherType)
    weather(
        @Args('city', { type: () => String }) city: string,
        @Args('country', { type: () => String }) country: string
    ): Promise<WeatherForecast>
    {
        return this.getWeather.execute(city, country);
    }
}
