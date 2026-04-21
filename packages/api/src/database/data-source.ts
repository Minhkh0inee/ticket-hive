import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

const envFile =
  process.env.NODE_ENV === 'production' ? '.env.production' : '.env';
dotenv.config({ path: join(__dirname, '../../../../', envFile) });

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*{.ts,.js}'],
  synchronize: false,
  logging: process.env.NODE_ENV === 'development',
  extra: { max: 10, min: 2, idleTimeoutMillis: 30000, connectionTimeoutMillis: 10000, },
});
