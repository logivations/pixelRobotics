import { Body, Controller, Post } from '@nestjs/common';
import { MailService } from './mail.service';
import MailDataDto from './mail-dto/mail.data.dto'

@Controller('api/mail')
export class MailController {
  constructor(private readonly mailService: MailService) {}

  @Post('sendMail')
  async addTodo(@Body() mailData: MailDataDto) {
    const { email, name } = mailData;
    console.log('email, name', email, name)
    await this.mailService.sendMail(email, name);
  }
}
