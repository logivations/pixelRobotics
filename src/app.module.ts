import { Module } from '@nestjs/common';
import { EnvironmentConfigModule } from './infrastructure/config/environment-config/environment-config.module';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { ExceptionsModule } from './infrastructure/exceptions/exceptions.module';
import { ControllersModule } from './infrastructure/controllers/controllers.module';
import { UserActivityModule } from './infrastructure/modules/user-activity/user-activity.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import config from './infrastructure/config/typeorm/typeorm.config';

@Module({
  imports: [
    LoggerModule,
    ExceptionsModule,
    ControllersModule,
    EnvironmentConfigModule,
    TypeOrmModule.forRoot(config),
    UserActivityModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
