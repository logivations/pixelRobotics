import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { MailService } from './mail.service';
import { SentMessageInfo } from 'nodemailer';
import { getLangFromCookie } from '../infrastructure/utils';
import { FastifyRequest } from 'fastify';

@Controller('api/mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('sendMail')
  async sendMail(@Body() mailData: string): Promise<SentMessageInfo[]> {
    return this.mailService.sendMail(JSON.parse(mailData));
  }

  @Post('subscribeEvent')
  subscribeEvent(
    @Req() request: FastifyRequest,
    @Body() subscriberData: any,
  ): Promise<SentMessageInfo> {
    const lang = getLangFromCookie(request);
    return this.mailService.subscribeToEvent(
      JSON.parse(subscriberData),
      lang,
    );
  }
}
