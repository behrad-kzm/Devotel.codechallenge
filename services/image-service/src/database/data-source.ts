import 'reflect-metadata';
import { DataSource, DataSourceOptions } from 'typeorm';

// this file will use in pipeline
// checkout package.json > migration:XX for more information

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST_MASTER,
  port: parseInt(process.env.DATABASE_PORT ?? "5432", 10),
  username: `${process.env.DATABASE_USERNAME}`,
  password: `${process.env.DATABASE_PASSWORD}`,
  database: `${process.env.DATABASE_NAME}`,
  synchronize: `${process.env.DATABASE_SYNCHRONIZE}` === 'true',
  autoLoadEntities: true,
  // dropSchema: false,
  // keepConnectionAlive: true,
  // logging: process.env.NODE_ENV !== 'production',
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/**/*{.ts,.js}'],
} as DataSourceOptions);
