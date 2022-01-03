import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import MailDataDto from "./mail-dto/mail.data.dto";

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendMail(mailData: MailDataDto) {
    const { email, name, firma, titel, message } = mailData;

    await this.mailerService.sendMail({
      // to: 'info@pixel-robotics.eu',
      to: 'volodymyr.boichuk@logivations.com',
      from: `${name}<info@pixel-robotics.eu>`,
      subject: 'Kontakt | Pixel Robotics',
      template: './mailToPixelInfoTemplate',
      headers: [
        { key: 'Mime-Version', value: '1.0' },
        { key: 'Content-Type', value: 'text/plain;charset=UTF-8' },
      ],
      context: { name, email, firma, titel, message },
    });
    await this.mailerService.sendMail({
      // to: 'info@pixel-robotics.eu',
      to: email,
      from: `${name}<info@pixel-robotics.eu>`,
      subject: 'Kontakt | Pixel Robotics',
      template: './mailToClientTemplate',
      headers: [
        { key: 'Mime-Version', value: '1.0' },
        { key: 'Content-Type', value: 'text/plain;charset=UTF-8' },
      ],
      context: {
        name: name,
      },
    });
  }
}
