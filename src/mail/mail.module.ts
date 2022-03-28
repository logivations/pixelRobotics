import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { EnvironmentConfigModule } from '../infrastructure/config/environment-config/environment-config.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [HttpModule, EnvironmentConfigModule],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
