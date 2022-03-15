import { Module } from '@nestjs/common';
import { EnvironmentConfigModule } from './infrastructure/config/environment-config/environment-config.module';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { ExceptionsModule } from './infrastructure/exceptions/exceptions.module';
import { ControllersModule } from './infrastructure/controllers/controllers.module';
import { UserActivityModule } from './infrastructure/modules/user-activity/user-activity.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import typeOrmConfig from './infrastructure/config/typeorm/typeorm.config';
import winstonConfig from './infrastructure/config/winston/config';
import { WinstonModule } from 'nest-winston';

@Module({
  imports: [
    LoggerModule,
    ExceptionsModule,
    ControllersModule,
    EnvironmentConfigModule,
    TypeOrmModule.forRoot(typeOrmConfig),
    UserActivityModule,
    WinstonModule.forRoot(winstonConfig),
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
