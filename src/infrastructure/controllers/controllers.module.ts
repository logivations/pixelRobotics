import { Module } from '@nestjs/common';
import { MailController } from '../../mail/mail.controller';
import { ViewController } from './view-controller/view.controller';
import { MailModule } from '../../mail/mail.module';

@Module({
  imports: [MailModule],
  controllers: [MailController, ViewController],
})
export class ControllersModule {}
