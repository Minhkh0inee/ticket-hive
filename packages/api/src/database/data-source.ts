import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { join } from 'path';

dotenv.config({ path: join(__dirname, '../../../../.env') });

console.log('CWD:', process.cwd());
console.log('DATABASE_URL:', process.env.DATABASE_URL);

export default new DataSource({
  type: 'postgres',
  url: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/database/migrations/*-migration.ts'],
  synchronize: false,
});