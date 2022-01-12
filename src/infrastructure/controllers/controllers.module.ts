import { Module } from '@nestjs/common';
import { MailController } from '../../mail/mail.controller';
import { ViewController } from './view-controller/view.controller';
import { MailModule } from '../../mail/mail.module';
import { AdminModule } from "./admin-controller/admin.module";
import { UserActivityModule } from '../modules/user-activity/user-activity.module';

@Module({
  imports: [MailModule, UserActivityModule, AdminModule],
  controllers: [MailController, ViewController],
})
export class ControllersModule {}
