import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { EnvironmentConfigModule } from '../infrastructure/config/environment-config/environment-config.module';
import { HttpModule } from '@nestjs/axios';
import { ConfigModule } from '../infrastructure/modules/configs/config.module';

@Module({
  imports: [HttpModule, ConfigModule, EnvironmentConfigModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
