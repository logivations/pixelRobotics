import { Module } from '@nestjs/common';
import { EnvironmentConfigModule } from './infrastructure/config/environment-config/environment-config.module';
import { LoggerModule } from './infrastructure/logger/logger.module';
import { ExceptionsModule } from './infrastructure/exceptions/exceptions.module';
import { ControllersModule } from './infrastructure/controllers/controllers.module';
import { MailModule } from './mail/mail.module';

@Module({
  imports: [
    LoggerModule,
    ExceptionsModule,
    ControllersModule,
    EnvironmentConfigModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
