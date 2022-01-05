import { Module } from '@nestjs/common';
import { MailController } from '../../mail/mail.controller';
import { ViewController } from './view-controller/view.controller';
import { MailModule } from '../../mail/mail.module';
import { UserActivityModule } from "../modules/user-activity/user-activity.module";

@Module({
  imports: [MailModule, UserActivityModule],
  controllers: [MailController, ViewController],
})
export class ControllersModule {}
