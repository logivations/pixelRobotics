import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('api/mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('sendMail')
  async sendMail(@Body() mailData: string) {
    await this.mailService.sendMail(JSON.parse(mailData));
  }

  @Post('subscribeEvent')
  async subscribeEvent(@Body() subscriberData: string) {
    await this.mailService.subscribeToEvent(JSON.parse(subscriberData));
  }
}
