import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { MercuriusDriver, type MercuriusDriverConfig } from '@nestjs/mercurius';

import { databaseConfig } from './database.source.js';

@Module({
    imports: [
        TypeOrmModule.forRoot({
            ...databaseConfig,
            autoLoadEntities: true,
        }),
        // GraphQLModule.forRoot<MercuriusDriverConfig>({
        //     driver: MercuriusDriver,
        //     autoSchemaFile: true
        // })
    ]
})
export class AppModule
{
}
