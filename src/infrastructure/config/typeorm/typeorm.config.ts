import { ConnectionOptions } from 'typeorm';
import * as dotenv from 'dotenv';

if (process.env.NODE_ENV === 'local') {
  dotenv.config({ path: './env/local.env' });
}

const config: ConnectionOptions = {
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'root',
  password: '111111111',
  database: 'pixel_robotics',
  entities: [__dirname + '/../../**/*.entity{.ts,.js}'],
  synchronize: false,
  migrationsRun: true,
  migrationsTableName: 'migration_todo',
  migrations: ['database/migrations/**/*{.ts,.js}'],
  cli: {
    migrationsDir: 'database/migrations',
  },
  name: 'pixel_robotics',
};

export default config;
