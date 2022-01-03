import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import MailDataDto from './mail-dto/mail.data.dto';

@Controller('api/mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('sendMail')
  async addTodo(@Body() mailData: MailDataDto) {
    await this.mailService.sendMail(mailData);
  }
}
