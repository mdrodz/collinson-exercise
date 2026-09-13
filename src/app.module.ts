import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { MercuriusDriver, type MercuriusDriverConfig } from '@nestjs/mercurius';
import { WeatherResolver } from './adapters/inbound/graphql/resolvers/weather.resolver.js';
import { OpenMeteoGeocodingAdapter } from './adapters/outbound/geocoding/open-meteo.adapter.js';
import { OpenMeteoWeatherAdapter } from './adapters/outbound/weather/open-meteo.adapter.js';
import { GetWeatherService } from './core/application/get-weather.service.js';
import { GEOCODING_PORT } from './core/ports/outbound/geocoding.port.js';
import { WEATHER_PORT } from './core/ports/outbound/weather.port.js';
import { GET_WEATHER_PORT } from './core/ports/inbound/get-weather.port.js';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports: [
        ConfigModule.forRoot({
            isGlobal: true
        }),
        CacheModule.registerAsync({
            inject: [ConfigService],
            useFactory: (configService: ConfigService) => {
                const protocol = configService.getOrThrow<string>('REDIS_PROTOCOL');
                const host = configService.getOrThrow<string>('REDIS_HOST');
                const port = configService.getOrThrow<number>('REDIS_PORT');

                return {
                    ttl: 60 * 60 * 1000, // 1 hour in milliseconds
                    stores: [
                        createKeyv(`${protocol}://${host}:${port}`),
                    ]
                };
            }
        }),
        GraphQLModule.forRoot<MercuriusDriverConfig>({
            driver: MercuriusDriver,
            autoSchemaFile: true
        })
    ],
    providers: [
        WeatherResolver,
        { provide: GET_WEATHER_PORT, useClass: GetWeatherService },
        { provide: GEOCODING_PORT, useClass: OpenMeteoGeocodingAdapter },
        { provide: WEATHER_PORT, useClass: OpenMeteoWeatherAdapter }
    ]
})
export class AppModule
{
}
