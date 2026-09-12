import * as dotenv from 'dotenv';
import { DataSource, type DataSourceOptions } from "typeorm";

dotenv.config();

export const databaseConfig: DataSourceOptions = {
    type: 'mysql' as const,
    host: process.env.DB_HOST,
    port: Number.parseInt(process.env.DB_PORT ?? '3306', 10),
    username: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    synchronize: false,
    entities: [import.meta.dirname + '/**/*.entity.ts'],
    migrations: [import.meta.dirname + '/migrations/*.ts']
};

export default new DataSource(databaseConfig);
