import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import { SentMessageInfo } from 'nodemailer';

@Controller('api/mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('sendMail')
  async sendMail(@Body() mailData: string): Promise<SentMessageInfo[]> {
    return this.mailService.sendMail(JSON.parse(mailData));
  }

  @Post('subscribeEvent')
  async subscribeEvent(@Body() subscriberData: any): Promise<SentMessageInfo> {
    return this.mailService.subscribeToEvent(JSON.parse(subscriberData));
  }
}
