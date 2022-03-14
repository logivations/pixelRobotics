import { Module } from '@nestjs/common';
import { MailController } from '../../mail/mail.controller';
import { ViewController } from './view-controller/view.controller';
import { MailModule } from '../../mail/mail.module';
import { AdminModule } from './admin-controller/admin.module';
import { UserActivityModule } from '../modules/user-activity/user-activity.module';
import { CommonModule } from "./common-controller/common.module";
import { CommonService } from "./common-controller/common.service";
import { HelpUaController } from "./view-controller/help.ua.controller";

@Module({
  imports: [MailModule, UserActivityModule, AdminModule, CommonModule],
  controllers: [MailController, ViewController, HelpUaController],
  providers: [CommonService]
})
export class ControllersModule {}
